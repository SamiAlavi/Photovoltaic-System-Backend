import admin from 'firebase-admin';
import enviroment from '../../../env';
import * as firebase from 'firebase/app';
import firebaseConfig from '../../../firebaseConfig';

const firebaseAdminApp = admin.initializeApp({
    credential: admin.credential.cert(enviroment.FIREBASE_SERVICEACCOUNT)
});

const firebaseApp = firebase.initializeApp(firebaseConfig);

export { firebaseAdminApp, firebaseApp };
