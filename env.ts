import dotenv from 'dotenv';

dotenv.config();

const environment = {
    PORT: parseInt(process.env.PORT ?? "3000"),
    ENVIRONMENT: process.env.ENVIRONMENT ?? "development",
    FIREBASE_SERVICEACCOUNT: process.env.FIREBASE_SERVICEACCOUNT ?? "./serviceAccount.json",
    APIKEY_VISUALCROSSING: process.env.APIKEY_VISUALCROSSING ?? "B3BE35ZP5FNMLRQNHNFEEK2A8",
    APIKEY_SENDGRID: process.env.APIKEY_SENDGRID ?? "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",
    SENDGRID_VERIFIEDSENDER: process.env.SENDGRID_VERIFIEDSENDER ?? "sami.mansooralavi99@gmail.com",
    SESSION_SECRET: process.env.SESSION_SECRET ?? "TTKqn+G8LU4D@^79vx23kJ7$=$@hk@qE_L^Us*4GLza@YHG*Ga7Nf8ng_j%-u&cF!nxV=2?HF6S%bGGfCkxR+3v75GH6r2M&AJXs",
    SESSION_TIMEOUT: parseInt(process.env.SESSION_TIMEOUT ?? "604800000"), // 1 week (in ms)
};

export default environment;
