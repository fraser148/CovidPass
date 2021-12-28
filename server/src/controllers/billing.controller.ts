import { Request, Response } from "express";
import { stripe } from '../';
import Stripe from "stripe";
import db from "../models/index";
import { auth } from '../firebase';

const Company = db.company;
const Subscription = db.subscription


const getOrCreateCustomer = async (userId: string, params?: Stripe.CustomerCreateParams) => {

    const user = await Company.findOne({ where: { id: userId }});
    
    if (!user.stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            metadata: {
                firebaseUID: userId
            },
            ...params
        });
        await Company.update({ stripeCustomerId: customer.id}, { where: { id: userId }});
        return customer;
    } else {
        return await stripe.customers.retrieve(user.stripeCustomerId) as Stripe.Customer;
    }
};

const createPaymentIntent = async (req: Request, res: Response) => {
    const { amount } = req.body
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'gbp'
    });

    res.send(paymentIntent);
}

const createSetupIntent = async(req: Request, res: Response) => {
    const user = validateUser(req);
    const customer = await getOrCreateCustomer(user.uid);

    const si = await stripe.setupIntents.create({
        customer: customer.id
    });

    res.send(si);
}

const listPaymentMethods = async (req: Request, res: Response) => {
    const user = validateUser(req);

    const customer = await getOrCreateCustomer(user.uid)

    const wallet = await stripe.paymentMethods.list({
        customer: customer.id,
        type: "card"
    })
    
    res.send(wallet.data)
    
}

const createStripeCheckoutSession = async (req: Request, res: Response) => {
    const { line_items } = req.body ;

    const url = process.env.WEBAPP_URL;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/failed`
    });

    res.send(session);
}

const listSubscriptions = async (req: Request, res: Response) => {
    const user = validateUser(req);

    const customer = await getOrCreateCustomer(user.uid);
    const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
    });

    res.send(subscriptions.data)
}

const createSubscription = async (req: Request, res: Response) => {
    const create = async (userId: string, plan: string, payment_method: string) => {
        const customer = await getOrCreateCustomer(userId);

        await stripe.paymentMethods.attach(payment_method, { customer: customer.id })

        await stripe.customers.update(customer.id, {
            invoice_settings: { default_payment_method: payment_method },
        });

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{plan}],
            expand: ['latest_invoice.payment_intent'],
        });

        const invoice = subscription.latest_invoice as Stripe.Invoice;
        const payment_intent = invoice.payment_intent as Stripe.PaymentIntent;
        const product = await stripe.products.retrieve(subscription.plan.product);

        if (payment_intent.status === 'succeeded') {
            await Subscription.create({
                priceId: plan,
                companyId: userId
            })
            auth.setCustomUserClaims(userId, {
                userRole: "company",
                userPlan: product.metadata.firebaseRole,
                company: userId
            });
        }

        return subscription;
    }

    const user = validateUser(req);
    const { plan, payment_method } = req.body;
    const subscription = await create(user.uid, plan, payment_method);
    res.send(subscription)
}

const cancelSubscription = async (req: Request, res: Response) => {
    const cancel = async (userId: string, subscriptionId: string) => {
        const customer = await getOrCreateCustomer(userId);
        if (customer.metadata.firebaseUID !== userId) {
            throw Error('Firebase UID does not match Stripe Customer');
        }
        const subscription = await stripe.subscriptions.del(subscriptionId);

        if (subscription.status === 'canceled') {
            await Subscription.destroy({
                where: {
                    priceId: subscription.plan.id,
                    companyId: userId
                }
            })
            auth.setCustomUserClaims(userId, {userRole: null, userPlan: null, company: null})
        }
        return subscription;
    }
    const user = validateUser(req);
    res.send(await cancel(user.uid, req.params.id));
}

function validateUser(req: Request) {
    const user = req['currentUser'];
    if (!user) {
        throw new Error(
            'You must be logged in to make this request.'
        )
    }

    return user;
}

export default {
    createPaymentIntent,
    createSetupIntent,
    listPaymentMethods,
    createStripeCheckoutSession,
    listSubscriptions,
    createSubscription,
    cancelSubscription
}