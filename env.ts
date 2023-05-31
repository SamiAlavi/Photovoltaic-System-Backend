import dotenv from 'dotenv';

dotenv.config();

const environment = {
    PORT: process.env.PORT ?? 3000,
    ENVIRONMENT: process.env.ENVIRONMENT ?? "development",
    FIREBASE_SERVICEACCOUNT: process.env.FIREBASE_SERVICEACCOUNT ?? "./src/services/firebase/serviceAccount.json",
};

export default environment;
