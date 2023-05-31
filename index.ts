import express, { Express, Request, Response } from 'express';
import environment from './env';

// Routers
import swaggerRoute from './src/routers/swaggerRoute';

const app: Express = express();
const port = environment.PORT;

if (environment.ENVIRONMENT === 'development') {
    app.use(swaggerRoute);
}

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
