import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import environment from './env';
import './src/cronjob';

// Middlewares
import routeLogger from './src/middlewares/routeLogger';
import authentication from './src/middlewares/authentication';

// Routers
import swaggerRoute from './src/routers/swaggerRoute';
import authenticationRoute from './src/routers/authentication';
import errorHandler from './src/middlewares/errorHandler';
import { CustomRequest } from './src/shared/interfaces';

const app = express();
const port = environment.PORT;
const isProduction = environment.ENVIRONMENT === "production";

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(routeLogger);

if (environment.ENVIRONMENT === 'development') {
    app.use(swaggerRoute);
}

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});
app.use('/', authenticationRoute);
app.use(authentication);

app.get('/test', (req: CustomRequest, res: Response) => {
    res.send(req.auth);
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
