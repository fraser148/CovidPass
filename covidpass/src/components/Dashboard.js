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

export default function Dashboard() {
    const [user, userLoading] = useAuthState(auth);
    const userIsPremium = usePremiumStatus(user);

    const [loading, setLoading] = useState(false);

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
                                        </Col>

                                        <Col lg={6}>
                                        </Col>

                                        <Col lg={12}>
                                        </Col>





                                        {/* <p>
                                            Selected Plan: <strong>{plan}</strong>
                                        </p> */}
                                
                                    </Row>
                                </div>
                            </Container>
                            ) : (
                                <>
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