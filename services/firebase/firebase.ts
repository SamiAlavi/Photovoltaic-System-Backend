import admin from 'firebase-admin';
const serviceAccount = "services/firebase/serviceAccount.json"

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export { app };