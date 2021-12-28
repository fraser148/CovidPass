"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = void 0;
const _1 = require("./");
// import { db } from './firebase';
// import { firestore } from 'firebase-admin';
const models_1 = __importDefault(require("./models"));
const Subscription = models_1.default.subscription;
const webhookHandlers = {
    'checkout.session.completed': async (data) => {
        // Add your business logic here
    },
    'payment_intent.succeeded': async (data) => {
        // Add your business logic here
    },
    'payment_intent.payment_failed': async (data) => {
        // Add your business logic here
    },
    'customer.subscription.deleted': async (data) => {
        const customer = await _1.stripe.customers.retrieve(data.customer);
        const userId = customer.metadata.firebaseUID;
        await Subscription.destroy({
            where: {
                companyId: userId,
                priceId: data.plan.id
            }
        });
        // const userRef = db.collection('users').doc(userId);
        //   await userRef
        //     .update({
        //       activePlans: firestore.FieldValue.arrayRemove(data.plan.id),
        //     });
    },
    'customer.subscription.created': async (data) => {
        const customer = await _1.stripe.customers.retrieve(data.customer);
        const userId = customer.metadata.firebaseUID;
        await Subscription.create({
            companyId: userId,
            priceId: data.plan.id
        });
        // const userRef = db.collection('users').doc(userId);
        //   await userRef
        //     .update({
        //       activePlans: firestore.FieldValue.arrayUnion(data.plan.id),
        //     });
    },
    'invoice.payment_succeeded': async (data) => {
        // Add your business logic here
    },
    'invoice.payment_failed': async (data) => {
        const customer = await _1.stripe.customers.retrieve(data.customer);
        // const userSnapshot = await db.collection('users').doc(customer.metadata.firebaseUID).get();
        // await userSnapshot.ref.update({ status: 'PAST_DUE' });
        await Subscription.update({ status: "PAST_DUE" }, {
            where: {
                companyId: customer.metadata.firebaseUID,
                priceId: data.plan.id
            }
        });
    }
};
exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const event = _1.stripe.webhooks.constructEvent(req['rawBody'], sig, process.env.STRIPE_WEBHOOK_SECRET);
    try {
        console.log(event.type);
        await webhookHandlers[event.type](event.data.object);
        res.send({ recieved: true });
    }
    catch (err) {
        console.error(err);
        res.send(400).send(`Webhook Error: ${err}`);
    }
};
//# sourceMappingURL=webhooks.js.map