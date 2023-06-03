import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import environment from './env';
import './src/cronjob';

// Middlewares
import routeLogger from './src/middlewares/routeLogger';

// Routers
import swaggerRoute from './src/routers/swaggerRoute';
import authenticationRoute from './src/routers/authentication';
import errorHandler from './src/middlewares/errorHandler';

const app: Express = express();
const port = environment.PORT;

app.use(cors());
app.use(express.json());
app.use(routeLogger);

if (environment.ENVIRONMENT === 'development') {
    app.use(swaggerRoute);
}
app.use('/auth', authenticationRoute);

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
