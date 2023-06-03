import admin from 'firebase-admin';
import enviroment from '../../../env';
const firebase = require('firebase/app');
import firebaseConfig from './firebaseConfig';

const app = admin.initializeApp({
    credential: admin.credential.cert(enviroment.FIREBASE_SERVICEACCOUNT)
});

const firebaseApp = firebase.initializeApp(firebaseConfig);

export { app, firebaseApp };
