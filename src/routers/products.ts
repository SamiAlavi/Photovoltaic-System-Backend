import { Router, Request } from 'express';
import productService from "../services/productService";
import AppSettings from '../../AppSettings';
import Helpers from '../shared/helpers';
import { IProductsGetResponse } from '../shared/responsesInterfaces';

const router = Router();

/**
 * @swagger
 * paths:
 *   /product:
 *     get:
 *       summary: Get products
 *       tags:
 *         - Products
 *       security:
 *         - BearerAuth: []
 *         - X-UID: []
 *       responses:
 *         '200':
 *           description: Successful response with products
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IProductsGetResponse'
 *         '400':
 *           $ref: '#/components/responses/ErrorResponse'
 */
router.get(AppSettings.RouteBase, async (req: Request, res: IProductsGetResponse) => {
    try {
        const projects = await productService.getProducts();
        res.status(200).json(projects);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

export default router;
