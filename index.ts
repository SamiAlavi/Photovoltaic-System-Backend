import express, { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './swaggerconfig';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});