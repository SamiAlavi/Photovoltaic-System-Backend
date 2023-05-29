import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './swaggerconfig';
import { Router } from 'express';

const router = Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

export default router;
