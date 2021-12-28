"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const index_1 = __importDefault(require("../models/index"));
const firebase_1 = require("../firebase");
const Company = index_1.default.company;
const Subscription = index_1.default.subscription;
const getOrCreateCustomer = async (userId, params) => {
    const user = await Company.findOne({ where: { id: userId } });
    if (!user.stripeCustomerId) {
        const customer = await __1.stripe.customers.create(Object.assign({ email: user.email, metadata: {
                firebaseUID: userId
            } }, params));
        await Company.update({ stripeCustomerId: customer.id }, { where: { id: userId } });
        return customer;
    }
    else {
        return await __1.stripe.customers.retrieve(user.stripeCustomerId);
    }
};
const createPaymentIntent = async (req, res) => {
    const { amount } = req.body;
    const paymentIntent = await __1.stripe.paymentIntents.create({
        amount,
        currency: 'gbp'
    });
    res.send(paymentIntent);
};
const createSetupIntent = async (req, res) => {
    const user = validateUser(req);
    const customer = await getOrCreateCustomer(user.uid);
    const si = await __1.stripe.setupIntents.create({
        customer: customer.id
    });
    res.send(si);
};
const listPaymentMethods = async (req, res) => {
    const user = validateUser(req);
    const customer = await getOrCreateCustomer(user.uid);
    const wallet = await __1.stripe.paymentMethods.list({
        customer: customer.id,
        type: "card"
    });
    res.send(wallet.data);
};
const createStripeCheckoutSession = async (req, res) => {
    const { line_items } = req.body;
    const url = process.env.WEBAPP_URL;
    const session = await __1.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/failed`
    });
    res.send(session);
};
const listSubscriptions = async (req, res) => {
    const user = validateUser(req);
    const customer = await getOrCreateCustomer(user.uid);
    const subscriptions = await __1.stripe.subscriptions.list({
        customer: customer.id,
    });
    res.send(subscriptions.data);
};
const createSubscription = async (req, res) => {
    const create = async (userId, plan, payment_method) => {
        const customer = await getOrCreateCustomer(userId);
        await __1.stripe.paymentMethods.attach(payment_method, { customer: customer.id });
        await __1.stripe.customers.update(customer.id, {
            invoice_settings: { default_payment_method: payment_method },
        });
        const subscription = await __1.stripe.subscriptions.create({
            customer: customer.id,
            items: [{ plan }],
            expand: ['latest_invoice.payment_intent'],
        });
        const invoice = subscription.latest_invoice;
        const payment_intent = invoice.payment_intent;
        const product = await __1.stripe.products.retrieve(subscription.plan.product);
        if (payment_intent.status === 'succeeded') {
            await Subscription.create({
                priceId: plan,
                companyId: userId
            });
            firebase_1.auth.setCustomUserClaims(userId, {
                userRole: "company",
                userPlan: product.metadata.firebaseRole,
                company: userId
            });
        }
        return subscription;
    };
    const user = validateUser(req);
    const { plan, payment_method } = req.body;
    const subscription = await create(user.uid, plan, payment_method);
    res.send(subscription);
};
const cancelSubscription = async (req, res) => {
    const cancel = async (userId, subscriptionId) => {
        const customer = await getOrCreateCustomer(userId);
        if (customer.metadata.firebaseUID !== userId) {
            throw Error('Firebase UID does not match Stripe Customer');
        }
        const subscription = await __1.stripe.subscriptions.del(subscriptionId);
        if (subscription.status === 'canceled') {
            await Subscription.destroy({
                where: {
                    priceId: subscription.plan.id,
                    companyId: userId
                }
            });
            firebase_1.auth.setCustomUserClaims(userId, { userRole: null, userPlan: null, company: null });
        }
        return subscription;
    };
    const user = validateUser(req);
    res.send(await cancel(user.uid, req.params.id));
};
function validateUser(req) {
    const user = req['currentUser'];
    if (!user) {
        throw new Error('You must be logged in to make this request.');
    }
    return user;
}
exports.default = {
    createPaymentIntent,
    createSetupIntent,
    listPaymentMethods,
    createStripeCheckoutSession,
    listSubscriptions,
    createSubscription,
    cancelSubscription
};
//# sourceMappingURL=billing.controller.js.map