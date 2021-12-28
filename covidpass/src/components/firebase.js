import { initializeApp } from 'firebase/app';
import { getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore"; 
import { fetchFromAPI } from './helpers';

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

const googleProvider = new GoogleAuthProvider();

export const signInGoogle = async () => {
    const credential = await signInWithPopup(auth, googleProvider);
    const { uid, name, email } = credential.user;
    // db.collection('users').doc(uid).set({ email }, { merge: true });
    setDoc(doc(db, "users", uid), {email, name}, {merge: true})
    // Old end (firebase)
    await fetchFromAPI('employee/create', {
        body: {
            userId: uid,
            name,
            email,
            company: "Saura 2"
        }
    });
}

export const signInEmailPass = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

export const registerEmailPass = async (name, email, password, companyId) => {
    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const { uid } = credential.user
        // Old 
        setDoc(doc(db, "users", uid), {email, name, company: "Failte Foods"})
        updateProfile(auth.currentUser, {
            displayName: name
        });
        // old end (firestore)
        await fetchFromAPI('employee/create', {
            body: {
                userId: uid,
                name,
                email,
                companyId
            }
        });
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

export const PasswordResetEmail = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}