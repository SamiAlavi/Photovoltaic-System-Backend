import swaggerUi from 'swagger-ui-express';
import swaggerConfig from './swaggerConfig';
import swaggerJSDoc from 'swagger-jsdoc';
import { Request, Response, Router } from 'express';
import AppSettings from '../../AppSettings';

const router = Router();
const swaggerSpec = swaggerJSDoc(swaggerConfig);

router.get(AppSettings.RouteSwaggerJSON, (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(swaggerSpec, null, 4));
});

router.use(AppSettings.RouteSwagger, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
