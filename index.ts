import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import environment from './env';
import './src/cronjob';

// Middlewares
import routeLoggerMiddleware from './src/middlewares/routeLoggerMiddleware';

// Routers
import swaggerRoute from './src/routers/swaggerRoute';
import authenticationRoute from './src/routers/authentication';

const app: Express = express();
const port = environment.PORT;

app.use(cors());
app.use(express.json());
app.use(routeLoggerMiddleware);

if (environment.ENVIRONMENT === 'development') {
    app.use(swaggerRoute);
}
app.use('/login', authenticationRoute);

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
