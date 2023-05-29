import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

// Middlewares
import swaggerMiddleware from './middlewares/swaggerMiddleware';

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 3000;

if (process.env.ENVIRONMENT === 'development') {
    app.use(swaggerMiddleware);
}

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});