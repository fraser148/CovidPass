import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { fetchFromAPI } from './helpers';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './firebase';
import Header from './Header';



export function SignIn() {
    return (
        <Link className="button signin btn-dropdown" to={"/login"}>Sign In</Link>
        // <button  className="button signin btn-dropdown" onClick={signIn}>Sign In</button>
    )
}

export function SignOut(props) {
    return props.user && (
        // <button onClick={() => auth.signOut()}>
        //     Sign Out User {props.user.uid}
        // </button>
        <button className="button signout btn-dropdown" onClick={() => auth.signOut()}>Sign out</button>
    )
}

function SaveCard(props) {
    const stripe = useStripe();
    const elements = useElements();
    const [user, userLoading] = useAuthState(auth);
  
    const [setupIntent, setSetupIntent] = useState();
    const [wallet, setWallet] = useState([]);
  
    // Get the user's wallet on mount
    useEffect(() => {
        console.log(user)
      getWallet();
    }, [user]);
  
    // Create the setup intent
    const createSetupIntent = async (event) => {
      const si = await fetchFromAPI('billing/wallet');
      setSetupIntent(si);
    };
  
    // Handle the submission of card details
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      const cardElement = elements.getElement(CardElement);
      console.log("you are herr")
  
      // Confirm Card Setup
      const {
        setupIntent: updatedSetupIntent,
        error,
      } = await stripe.confirmCardSetup(setupIntent.client_secret, {
        payment_method: { card: cardElement },
      });
  
      if (error) {
        alert(error.message);
        console.log(error);
      } else {
        setSetupIntent(updatedSetupIntent);
        await getWallet();
        alert('Success! Card added to your wallet');
      }
    };
  
    const getWallet = async () => {
      if (user) {
        const paymentMethods = await fetchFromAPI('billing/wallet', { method: 'GET' });
        setWallet(paymentMethods);
      }
    };
  
    return (
      <div className="main">
        <Header />
        <h2>Customers</h2>
  
        <p>
          Save credit card details for future use. Connect a Stripe Customer ID to
          a Firebase User ID.
        </p>
        {!user && userLoading && <span>Loading...</span>}
        {!user && !userLoading && <SignIn />}
        {user && !userLoading && (
            <>
                      <div className="well">
            <h3>Step 1: Create a Setup Intent</h3>
  
            <button
              className="btn btn-success"
              onClick={createSetupIntent}
              hidden={setupIntent}>
              Attach New Credit Card
            </button>
          </div>
          <hr />
  
          <form
            onSubmit={handleSubmit}
            className="well"
            hidden={!setupIntent || setupIntent.status === 'succeeded'}>
            <h3>Step 2: Submit a Payment Method</h3>
            <p>Collect credit card details, then attach the payment source.</p>
            <p>
              Normal Card: <code>4242424242424242</code>
            </p>
            <p>
              3D Secure Card: <code>4000002500003155</code>
            </p>
  
            <hr />
  
            <CardElement />
            <button className="btn btn-success" type="submit">
              Attach
            </button>
          </form>
  
          <div className="well">
            <h3>Retrieve all Payment Sources</h3>
            <select className="form-control">
              {wallet.map((paymentSource) => (
                <CreditCard key={paymentSource.id} card={paymentSource.card} />
              ))}
            </select>
          </div>
          <div className="well">
            <SignOut user={user} />
          </div>
            </>
        )}

      </div>
    );
  }
  
  function CreditCard(props) {
    const { last4, brand, exp_month, exp_year } = props.card;
    return (
      <option>
        {brand} **** **** **** {last4} expires {exp_month}/{exp_year}
      </option>
    );
  }
  
  export default function Customers() {
    return (
      <Suspense fallback={'loading user'}>
        <SaveCard />
      </Suspense>
    );
  }