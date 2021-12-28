import React, { useState, useEffect, Suspense } from 'react';
import { fetchFromAPI, isUserPremium } from './helpers';
import { Container, Row, Col }  from 'react-bootstrap';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot } from "firebase/firestore"; 
import { db, auth } from './firebase';
import { SignIn, SignOut } from './Customers';
import Header from './Header';

const usePremiumStatus = (user) => {
    const [premiumStatus, setPremiumStatus] = useState(undefined);

    useEffect(() => {
        if (user) {
          const checkPremiumStatus = async function () {
            setPremiumStatus(await isUserPremium());
          };
          checkPremiumStatus();
        }
      }, [user]);
    
      return premiumStatus;
}

function UserData(props) {

  const [data, setData] = useState({});

  // Subscribe to the user's data in Firestore
    useEffect(
        () => {
            //   const unsubscribe = db.collection('users').doc(props.user.uid).onSnapshot(doc => setData(doc.data()) )
            const unsubscribe = onSnapshot(doc(db, 'users', props.user.uid), doc => setData(doc.data()))
            return () => unsubscribe()
        },
        [props.user]
    )

    return (
        <pre>
            Stripe Customer ID: {data.stripeCustomerId} <br />
            Subscriptions: {JSON.stringify(data.activePlans || [])}<br/>
            UserRole: {data.userRole}
        </pre>
    );
}

const Subscription = (props) => {
    return(
        <div className="subscription-plan">
            <div>
                {props.sub.map((sub) => (
                <div key={sub.id}>
                    <h3 className="plan-name">{props.type} Plan</h3>
                    Next payment of £{(sub.plan.amount/100).toFixed(2)} due{' '}
                    {new Date(sub.current_period_end * 1000).toUTCString()}
                    <button
                    className="btn btn-sm btn-danger"
                    onClick={() => props.cancel(sub.id)}
                    disabled={props.loading}>
                    Cancel
                    </button>
                </div>
                ))}
            </div>
        </div>
    )
}

function SubscribeToPlan(props) {
    const stripe = useStripe();
    const elements = useElements();
    const [user, userLoading] = useAuthState(auth);
    const userIsPremium = usePremiumStatus(user);

    const [plan, setPlan] = useState();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Get current subscriptions on mount
    useEffect(() => {
        getSubscriptions();
    }, [user]);

    // Fetch current subscriptions from the API
    const getSubscriptions = async () => {
        if (user) {
            const subs = await fetchFromAPI('billing/subscriptions', { method: 'GET' });
            setSubscriptions(subs);
        }
    };

    // Cancel a subscription
    const cancel = async (id) => {
        setLoading(true);
        await fetchFromAPI('billing/subscriptions/' + id, { method: 'PATCH' });
        alert('canceled!');
        await getSubscriptions();
        setLoading(false);
    };

    // Handle the submission of card details
    const handleSubmit = async (event) => {
        setLoading(true);
        user.getIdToken(true)
        event.preventDefault();

        const cardElement = elements.getElement(CardElement);

        // Create Payment Method
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }

        // Create Subscription on the Server
        console.log(plan)
        const subscription = await fetchFromAPI('billing/subscriptions', {
            body: {
                plan,
                payment_method: paymentMethod.id,
            },
        });

    // The subscription contains an invoice
    // If the invoice's payment succeeded then you're good, 
    // otherwise, the payment intent must be confirmed

    const { latest_invoice } = subscription;

    if (latest_invoice.payment_intent) {
        const { client_secret, status } = latest_invoice.payment_intent;

        if (status === 'requires_action') {
            const { error: confirmationError } = await stripe.confirmCardPayment(
                client_secret
            );
            if (confirmationError) {
                console.error(confirmationError);
                alert('unable to confirm card');
                return;
            }
        }

        // success
        alert('You are subscribed!');
        getSubscriptions();
    }

    setLoading(false);
    setPlan(null);
  };

  return (
    <div className="main">
        <Container className="container-main"> 
            <Header />
            <div className="content">
                <Row className="landing">
                    <Col lg={12}>
                    <h2>Subscriptions</h2>
                    <p>
                        Subscribe a user to a recurring plan, process the payment, and sync with
                        Firestore in realtime.
                    </p>

                    

                    {!user && userLoading && <span>Loading...</span>}
                    {!user && !userLoading && <SignIn />}
                    {user && !userLoading && (
                        <>
                            <div className="well">
                                <h2>Firestore Data</h2>
                                <p>User's data in Firestore.</p>
                                {user?.uid && <UserData user={user} />}

                            </div>
                            {!userIsPremium ? (
                                <Container>
                                <div className="subscriptions">
                                    <Row className="subs-row">
                                
                                        <Col lg={12}>
                                            <h2>Choose a Plan</h2>
                                        </Col>
                                        <Col lg={6}>
                                            <button
                                                className={
                                                'plan-choice ' +
                                                (plan === 'price_1K7NLuHFDZ6RFBmP7bj4Ytgt'
                                                    ? 'plan-chosen'
                                                    // : 'btn-outline-primary')
                                                    : '')
                                                }
                                                onClick={() => setPlan('price_1K7NLuHFDZ6RFBmP7bj4Ytgt')}>
                                                <img className="plan-img" src="./plans.png" alt="starter plan"/>
                                                <span className="plan-name">Starter</span>
                                                <span className="fee">£4.99 </span>
                                                <span className="each">/month</span>
                                                <ul>
                                                    <li>200 tests per month</li>
                                                    <li>Up to 20 employees</li>
                                                </ul>
                                                <span className="choose-me">Select Plan</span>
                                            </button>
                                        </Col>

                                        <Col lg={6}>
                                            <button
                                                className={
                                                'plan-choice ' +
                                                (plan === 'price_1K7NKqHFDZ6RFBmPnTAcWMdk'
                                                    ? 'plan-chosen'
                                                    : '')
                                                }
                                                onClick={() => setPlan('price_1K7NKqHFDZ6RFBmPnTAcWMdk')}>
                                                <img className="plan-img" src="./plans.png" alt="enterprise plan"/>
                                                <span className="plan-name">Enterprise</span>
                                                <span className="fee">£14.99 </span>
                                                <span className="each">/month</span>
                                                <ul>
                                                    <li>10,000 tests per month</li>
                                                    <li>Up to 200 employees</li>
                                                </ul>
                                                <span className="choose-me">Select Plan</span>
                                            </button>
                                        </Col>

                                        <Col lg={12} hidden={!plan}>
                                            <form onSubmit={handleSubmit} className="well">
                                                <h2>Submit a Payment Method</h2>
                                                <p>Your payment information:</p>
                                                {/* <p>
                                                    Normal Card: <code>4242424242424242</code>
                                                </p>
                                                <p>
                                                    3D Secure Card: <code>4000002500003155</code>
                                                </p> */}

                                                <CardElement className="payment-details" />
                                                <button className="btn btn-pay" type="submit" disabled={loading}>
                                                    Subscribe & Pay
                                                </button>
                                                
                                                {loading && (
                                                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                                                )}
                                            </form>
                                        </Col>





                                        {/* <p>
                                            Selected Plan: <strong>{plan}</strong>
                                        </p> */}
                                
                                    </Row>
                                </div>
                            </Container>
                            ) : (
                                <>
                                <Subscription 
                                    sub={subscriptions}
                                    loading={loading}
                                    cancel={cancel}
                                    type={userIsPremium}
                                />
                                </>
                            )}

                            <hr />

                            <div className="well">
                            <SignOut user={user} />
                            </div>
                        </>
                    )}
                    </Col>
                </Row>
            </div>
        </Container>
    </div>
  );
}

export default function Subscriptions() {
  return (
    <Suspense fallback={'loading user'}>
      <SubscribeToPlan />
    </Suspense>
  );
}