import { Router, Request } from 'express';
import productService from "../services/productService";
import AppSettings from '../../AppSettings';
import Helpers from '../shared/helpers';
import { IProductsGetResponse } from '../shared/responsesInterfaces';

const router = Router();

/**
 * @swagger
 * paths:
 *   /:
 *     get:
 *       summary: Get products
 *       tags:
 *         - Products
 *       responses:
 *         '200':
 *           description: Successful response with products
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IProductsGetResponse'
 */
router.get(AppSettings.RouteBase, async (req: Request, res: IProductsGetResponse) => {
    try {
        const projects = await productService.getProducts();
        res.json(projects);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

export default router;
