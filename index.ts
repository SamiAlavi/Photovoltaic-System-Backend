import express, { Express, Request, Response } from 'express';
import environment from './env';
import './src/cronjob';

// Middlewares
import routeLoggerMiddleware from './src/middlewares/routeLoggerMiddleware';

// Routers
import swaggerRoute from './src/routers/swaggerRoute';

const app: Express = express();
const port = environment.PORT;

app.use(routeLoggerMiddleware);

if (environment.ENVIRONMENT === 'development') {
    app.use(swaggerRoute);
}

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
