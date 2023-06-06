import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import environment from './env';
import './src/cronjob';
import { CustomRequest } from './src/shared/interfaces';
import AppSettings from './AppSettings';

// Middlewares
import routeLogger from './src/middlewares/routeLogger';
import authentication from './src/middlewares/authentication';
import errorHandler from './src/middlewares/errorHandler';

// Routers
import swaggerRoute from './src/routers/swaggerRoute';
import authenticationRoute from './src/routers/authentication';
import projectRoute from './src/routers/projects';

const app = express();
const port = environment.PORT;
const isProduction = environment.ENVIRONMENT === "production";

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(routeLogger);

if (!isProduction) {
    app.use(swaggerRoute);
}

app.get(AppSettings.RouteBase, (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use(AppSettings.RouteAuth, authenticationRoute);
app.use(authentication);

app.use(AppSettings.RouteProject, projectRoute);

app.get('/test', (req: CustomRequest, res: Response) => {
    res.send("Test");
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
