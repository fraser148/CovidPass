import React, { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { fetchFromAPI } from './helpers';

export function Checkout() {
    const stripe = useStripe();

    const [product, setProduct] = useState({
        name: 'Premium Stickers',
        description: "Nice sticker",
        images: [
            'https://images.unsplash.com/photo-1529458600305-b5bdde535770?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        ],
        amount: 299,
        currency: 'gbp',
        quantity: 0
    })

    const changeQuantity = (v) => {
        setProduct({ ...product, quantity: Math.max(0, product.quantity + v)});
    }

    const handleClick = async (e) => {
        const body = {line_items: [product]}
        const { id: sessionId } = await fetchFromAPI('checkouts', {
            body
        })

        const { error } = await stripe.redirectToCheckout({
            sessionId
        });

        if (error) {
            console.log(error)
        }
    }

    return (
        <>
        <h2>Stripe Checkout</h2>
        <p>
            Shopping-cart scenario. Change the quantity
            of the products below, then click checkout to open the Stripe Checkout
            window.
        </p>

        <div className="product">
            <h3>{product.name}</h3>
            <h4>Stripe Amount: {product.amount}</h4>

            <img src={product.images[0]} width="250px" alt="product" />

            <button
            className="btn btn-sm btn-warning"
            onClick={() => changeQuantity(-1)}>
            -
            </button>
            <span style={{ margin: '20px', fontSize: '2em' }}>
            {product.quantity}
            </span>
            <button
            className="btn btn-sm btn-success"
            onClick={() => changeQuantity(1)}>
            +
            </button>
        </div>

        <hr />

        <button
            className="btn btn-primary"
            onClick={handleClick}
            disabled={product.quantity < 1}>
            Start Checkout
        </button>
    </>
    )
}

export function CheckoutFail() {
    return <h3>Checout failed!</h3>
}

export function CheckoutSuccess() {
    const url = window.location.href;
    const sessionId = new URL(url).searchParams.get('session_id');
    return <h3>Checkout was a Success! {sessionId}</h3>
}