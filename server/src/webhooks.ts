import { stripe } from "./";
import Stripe from "stripe";
// import { db } from './firebase';
// import { firestore } from 'firebase-admin';

import db from './models';

const Subscription = db.subscription;

const webhookHandlers = {
  'checkout.session.completed': async (data: Stripe.Event.Data) => {
    // Add your business logic here
  },
  'payment_intent.succeeded': async (data: Stripe.PaymentIntent) => {
    // Add your business logic here
  },
  'payment_intent.payment_failed': async (data: Stripe.PaymentIntent) => {
    // Add your business logic here
  },
  'customer.subscription.deleted': async (data: Stripe.Subscription) => {
    const customer = await stripe.customers.retrieve( data.customer as string ) as Stripe.Customer;
    const userId = customer.metadata.firebaseUID;
    await Subscription.destroy({
      where: {
        companyId: userId,
        priceId: data.plan.id
      }
    })
    // const userRef = db.collection('users').doc(userId);

    //   await userRef
    //     .update({
    //       activePlans: firestore.FieldValue.arrayRemove(data.plan.id),
    //     });
  },
  'customer.subscription.created': async (data: Stripe.Subscription) => {
    const customer = await stripe.customers.retrieve( data.customer as string ) as Stripe.Customer;
    const userId = customer.metadata.firebaseUID;
    await Subscription.create({
      companyId: userId,
      priceId: data.plan.id
    })

    // const userRef = db.collection('users').doc(userId);

    //   await userRef
    //     .update({
    //       activePlans: firestore.FieldValue.arrayUnion(data.plan.id),
    //     });
  },
  'invoice.payment_succeeded': async (data: Stripe.Invoice) => {
    // Add your business logic here
  },
  'invoice.payment_failed': async (data: Stripe.Invoice) => {
    
    const customer = await stripe.customers.retrieve( data.customer as string ) as Stripe.Customer;
    // const userSnapshot = await db.collection('users').doc(customer.metadata.firebaseUID).get();
    // await userSnapshot.ref.update({ status: 'PAST_DUE' });
    await Subscription.update({ status: "PAST_DUE"}, {
      where: {
        companyId: customer.metadata.firebaseUID,
        priceId: data.plan.id
      }
    })
  }
}


export const handleStripeWebhook = async(req, res) => {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req['rawBody'], sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    try {
        console.log(event.type)
        await webhookHandlers[event.type](event.data.object);
        res.send({recieved: true});
    } catch (err) {
        console.error(err);
        res.send(400).send(`Webhook Error: ${err}`);
    }
}