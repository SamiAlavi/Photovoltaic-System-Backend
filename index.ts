import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

// Middlewares
import swaggerRoute from './routers/swaggerRoute';

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 3000;

if (process.env.ENVIRONMENT === 'development') {
    app.use(swaggerRoute);
}

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});