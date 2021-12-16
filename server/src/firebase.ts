import * as firebaseAdmin from 'firebase-admin';

var serviceAccount = require("../service-account.json");

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

export const db = firebaseAdmin.firestore();
export const auth = firebaseAdmin.auth();