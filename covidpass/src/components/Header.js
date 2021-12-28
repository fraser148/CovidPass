import React , { useState, useEffect } from 'react';
import { Container, Row, Col }  from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import Login from './Login';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './firebase';
import { SignIn, SignOut } from './Customers';
// import { createCheckoutSession } from "../stripe/createCheckoutSession";
// import isUserPremium from "../stripe/isUserPremium";

// const usePremiumStatus = (user) => {
//     const [premiumStatus, setPremiumStatus] = useState(false);

//     useEffect(() => {
//         if (user) {
//           const checkPremiumStatus = async function () {
//             setPremiumStatus(await isUserPremium());
//           };
//           checkPremiumStatus();
//         }
//       }, [user]);
    
//       return premiumStatus;
// }

const Header = () => {
    const [user, userLoading] = useAuthState(auth);

    // const userIsPremium = usePremiumStatus(user);
    return (
        <div className="header">
            <div className="header-content">
                <Link to="/"><img src="./Google.png" alt="logo"/></Link>
                <div className="links">
                    <Link to="/">Home</Link>
                    <Link to='/checkout'>Checkout</Link>
                    <Link to='/payments'>Payments</Link>
                    <Link to='/customers'>Customers</Link>
                    <Link to='/subscriptions'>Subscriptions</Link>
                    {!user && userLoading && <span>Loading...</span>}
                    {!user && !userLoading && <SignIn />}
                    {user && !userLoading && (
                        <div className="dropdown">
                            <span className="dropbtn">{user.displayName}</span>
                            <div className="dropdown-content">
                                <Link to="/dashboard" className="button signout btn-dropdown">Dashboard</Link>
                                <Link to="/qr" className="button signout btn-dropdown">QR Scanner</Link>
                                <SignOut user={user} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header;