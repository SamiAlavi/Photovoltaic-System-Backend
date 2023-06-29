import swaggerUi, { SwaggerUiOptions } from 'swagger-ui-express';
import swaggerConfig from './swaggerConfig';
import swaggerJSDoc from 'swagger-jsdoc';
import { Request, Response, Router } from 'express';
import AppSettings from '../../AppSettings';
import fileService from '../services/fileService';

const router = Router();
const swaggerSpec = swaggerJSDoc(swaggerConfig);
const swaggerOptions: SwaggerUiOptions = {
    explorer: true,
};

function writeSwaggerConfig(filePath: string) {
    const swaggerJson = JSON.stringify(swaggerSpec, null, 4);
    fileService.writeFileSync(filePath, swaggerJson);
}

router.get(AppSettings.RouteSwaggerJSON, (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    const swaggerJson = JSON.stringify(swaggerSpec, null, 4);
    res.send(swaggerJson);
});

router.use(AppSettings.RouteSwagger, swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// writeSwaggerConfig('swagger.json');

export default router;
