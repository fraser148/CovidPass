import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { BrowserRouter }  from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FirebaseAppProvider } from 'reactfire';
import 'bootstrap/dist/css/bootstrap.min.css';

export const stripePromise = loadStripe(
  'pk_test_GTLkHPeAw2AL0lfdyKmcneqe00BwlyVdqt'
);

const firebaseConfig = {
  apiKey: "AIzaSyBiT6Vi57oJ-7F3W8dAdiRuDeGaNh2dEOI",
  authDomain: "covidpass-9d328.firebaseapp.com",
  projectId: "covidpass-9d328",
  storageBucket: "covidpass-9d328.appspot.com",
  messagingSenderId: "560507975801",
  appId: "1:560507975801:web:f3609d5bf2248297707ca8",
  measurementId: "G-XPVPK3C8KP"
};

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Elements stripe={stripePromise}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Elements>
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
