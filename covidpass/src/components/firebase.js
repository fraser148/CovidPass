import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyBiT6Vi57oJ-7F3W8dAdiRuDeGaNh2dEOI",
    authDomain: "covidpass-9d328.firebaseapp.com",
    projectId: "covidpass-9d328",
    storageBucket: "covidpass-9d328.appspot.com",
    messagingSenderId: "560507975801",
    appId: "1:560507975801:web:f3609d5bf2248297707ca8",
    measurementId: "G-XPVPK3C8KP"
};

initializeApp(firebaseConfig)

export const db = getFirestore();
export const auth = getAuth();