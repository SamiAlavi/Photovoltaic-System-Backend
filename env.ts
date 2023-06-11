import dotenv from 'dotenv';

dotenv.config();

const environment = {
    PORT: parseInt(process.env.PORT ?? "3000"),
    ENVIRONMENT: process.env.ENVIRONMENT ?? "development",
    FIREBASE_SERVICEACCOUNT: process.env.FIREBASE_SERVICEACCOUNT ?? "./src/services/firebase/serviceAccount.json",
    APIKEY_OPENWEATHERMAP: process.env.APIKEY_OPENWEATHERMAP ?? "5668dbcf487d21a43f9d3b00fa1ffd49",
    APIKEY_WEATHERBIT: process.env.APIKEY_WEATHERBIT ?? "55a3337671724cbf90c3060894640919",
    APIKEY_VISUALCROSSING: process.env.APIKEY_VISUALCROSSING ?? "B3BE35ZP5FNMLRQNHNFEEK2A8",
    APIKEY_ACCUWEATHER: process.env.APIKEY_ACCUWEATHER ?? "AFhfDyUloVSF2aGHeWa7ebxpcy36dft6",
    SESSION_SECRET: process.env.SESSION_SECRET ?? "TTKqn+G8LU4D@^79vx23kJ7$=$@hk@qE_L^Us*4GLza@YHG*Ga7Nf8ng_j%-u&cF!nxV=2?HF6S%bGGfCkxR+3v75GH6r2M&AJXs",
    SESSION_TIMEOUT: parseInt(process.env.SESSION_TIMEOUT ?? "604800000"), // 1 week (in ms)
};

export default environment;
