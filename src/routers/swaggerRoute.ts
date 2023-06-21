import swaggerUi from 'swagger-ui-express';
import swaggerConfig from './swaggerConfig.json';
import { Router } from 'express';
import AppSettings from '../../AppSettings';

const router = Router();

router.use(AppSettings.RouteSwagger, swaggerUi.serve, swaggerUi.setup(swaggerConfig));

export default router;
