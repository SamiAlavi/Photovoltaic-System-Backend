import swaggerUi from 'swagger-ui-express';
import swaggerConfig from './swaggerconfig.json';
import { Router } from 'express';

const router = Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

export default router;
