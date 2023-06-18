import { Router, Response } from 'express';
import projectService from "../services/projectService";
import AppSettings from '../../AppSettings';
import { IAddProductRequest, ICustomRequest, IProductDetail, IProject } from '../shared/interfaces';

const router = Router();

router.get(AppSettings.RouteBase, async (req: ICustomRequest, res: Response) => {
    try {
        const projects = await projectService.getProjects(req.userUid);
        res.send(projects);
    }
    catch (error: any) {
        handleError(res, error);
    }
});

router.get(AppSettings.RouteId, async (req: ICustomRequest, res: Response) => {
    try {
        const projectId = decodeURIComponent(req.params.id);
        const project = await projectService.getProject(req.userUid, projectId);
        res.send(project);
    }
    catch (error: any) {
        handleError(res, error);
    }
});

router.post(AppSettings.RouteBase, async (req: ICustomRequest, res: Response) => {
    try {
        const projectId: string = req.body.projectId;
        const project = projectService.createProject(req.userUid, projectId);
        res.status(201).send(project);
    }
    catch (error: any) {
        handleError(res, error);
    }
});
router.delete(AppSettings.RouteBase, async (req: ICustomRequest, res: Response) => {
    try {
        const projectId: string = req.body.projectId;
        projectService.deleteProject(req.userUid, projectId);
        res.status(204).send(true);
    }
    catch (error: any) {
        handleError(res, error);
    }
});

router.post(AppSettings.RouteAddEditDeleteProduct, async (req: ICustomRequest, res: Response) => {
    try {
        const { projectId, product } = req.body as IAddProductRequest;
        projectService.addProductInProject(req.userUid, projectId, product);
        res.status(201).send({});
    }
    catch (error: any) {
        handleError(res, error);
    }
});

router.put(AppSettings.RouteAddEditDeleteProduct, async (req: ICustomRequest, res: Response) => {
    try {
        const { projectId, product } = req.body as IAddProductRequest;
        projectService.editProductInProject(req.userUid, projectId, product);
        res.status(204).send({});
    }
    catch (error: any) {
        handleError(res, error);
    }
});

router.delete(AppSettings.RouteAddEditDeleteProduct, async (req: ICustomRequest, res: Response) => {
    try {
        const { projectId, product } = req.body as IAddProductRequest;
        projectService.deleteProductInProject(req.userUid, projectId, product);
        res.status(204).send({});
    }
    catch (error: any) {
        handleError(res, error);
    }
});

router.post(AppSettings.RouteProductReport, async (req: ICustomRequest, res: Response) => {
    try {
        const { projectId, product } = req.body as IAddProductRequest;
        const reportData = await projectService.generateProductReport(req.userUid, projectId, product);
        res.status(200).send(reportData);
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
