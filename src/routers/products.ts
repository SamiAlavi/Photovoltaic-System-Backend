import { Router, Request, Response } from 'express';
import productService from "../services/productService";
import AppSettings from '../../AppSettings';

const router = Router();

router.get(AppSettings.RouteBase, async (req: Request, res: Response) => {
    try {
        const projects = await productService.getProducts();
        res.send(projects);
    }
    catch (error: any) {
        handleError(res, error);
    }
});

function handleError(res: Response, error: Error) {
    res.status(400).send({
        message: error.message,
    });
}

export default router;
