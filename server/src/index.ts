import { config } from "dotenv"
import Stripe from "stripe";
import { app } from './api';

if (process.env.NODE_ENV !== 'production') {
    config();
}

export const stripe = new Stripe(process.env.STRIPE_SECRET, {
    apiVersion: '2020-08-27',
})

const port = process.env.PORT || 3333;
app.listen(port, () => console.log('API on http://localhost:' + port));