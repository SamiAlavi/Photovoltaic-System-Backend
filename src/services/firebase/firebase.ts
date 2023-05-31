import admin from 'firebase-admin';
import enviroment from '../../../env';

const app = admin.initializeApp({
    credential: admin.credential.cert(enviroment.FIREBASE_SERVICEACCOUNT)
});

export { app };
