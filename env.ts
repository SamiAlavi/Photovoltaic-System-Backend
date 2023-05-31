import dotenv from 'dotenv';

dotenv.config();

const environment = {
    PORT: process.env.PORT ?? 3000,
    ENVIRONMENT: process.env.ENVIRONMENT ?? "development",
    FIREBASE_SERVICEACCOUNT: process.env.FIREBASE_SERVICEACCOUNT ?? "./src/services/firebase/serviceAccount.json",
    APIKEY_OPENWEATHERMAP: process.env.APIKEY_OPENWEATHERMAP ?? "5668dbcf487d21a43f9d3b00fa1ffd49",
    APIKEY_WEATHERBIT: process.env.APIKEY_WEATHERBIT ?? "55a3337671724cbf90c3060894640919",
};

export default environment;
