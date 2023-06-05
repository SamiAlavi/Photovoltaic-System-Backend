import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import environment from './env';
import session, { SessionOptions } from 'express-session';
import { firebaseAdminApp } from './src/services/firebase/firebase';
const FirestoreStore = require('firestore-store')(session);
import './src/cronjob';

// Middlewares
import routeLogger from './src/middlewares/routeLogger';
import authentication from './src/middlewares/authentication';

// Routers
import swaggerRoute from './src/routers/swaggerRoute';
import authenticationRoute from './src/routers/authentication';
import errorHandler from './src/middlewares/errorHandler';

const app = express();
const port = environment.PORT;
const isProduction = environment.ENVIRONMENT === "production";

const expressFireStore = new FirestoreStore({
    database: firebaseAdminApp.firestore(),
    collection: "express-sessions",
});

const sessionConfig: SessionOptions = {
    secret: environment.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: expressFireStore,
    cookie: {
        httpOnly: true,
        secure: isProduction,
        maxAge: environment.SESSION_TIMEOUT,
        sameSite: isProduction ? "none" : "lax",
    },
};

app.use(cors());
app.use(session(sessionConfig));
app.use(bodyParser.json());
app.use(routeLogger);
app.use(authentication);

if (environment.ENVIRONMENT === 'development') {
    app.use(swaggerRoute);
}

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});
app.use('/', authenticationRoute);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
