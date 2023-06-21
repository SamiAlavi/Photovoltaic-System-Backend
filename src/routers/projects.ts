import { Router, Response } from 'express';
import projectService from "../services/projectService";
import AppSettings from '../../AppSettings';
import { ICustomRequest, IProductAddRequest, IProductDeleteRequest, IProductUpdateRequest, IProjectCreateRequest, IProjectDeleteRequest } from '../shared/requestsInterfaces';
import Helpers from '../shared/helpers';

const router = Router();

router.get(AppSettings.RouteBase, async (req: ICustomRequest, res: Response) => {
    try {
        const userUid = req.userUid;
        const projects = await projectService.getProjects(userUid);
        res.send(projects);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.post(AppSettings.RouteBase, async (req: IProjectCreateRequest, res: Response) => {
    try {
        const userUid = req.userUid;
        const { projectId } = req.body;
        const project = projectService.createProject(userUid, projectId);
        res.status(201).send(project);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.delete(AppSettings.RouteBase, async (req: IProjectDeleteRequest, res: Response) => {
    try {
        const userUid = req.userUid;
        const { projectId } = req.body;
        projectService.deleteProject(userUid, projectId);
        res.status(204).send(true);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.post(AppSettings.RouteAddEditDeleteProduct, async (req: IProductAddRequest, res: Response) => {
    try {
        const userUid = req.userUid;
        const { projectId, product } = req.body;
        projectService.addProductInProject(userUid, projectId, product);
        res.status(201).send({});
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.put(AppSettings.RouteAddEditDeleteProduct, async (req: IProductUpdateRequest, res: Response) => {
    try {
        const userUid = req.userUid;
        const { projectId, product } = req.body;
        projectService.editProductInProject(userUid, projectId, product);
        res.status(204).send({});
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.delete(AppSettings.RouteAddEditDeleteProduct, async (req: IProductDeleteRequest, res: Response) => {
    try {
        const userUid = req.userUid;
        const { projectId, product } = req.body;
        projectService.deleteProductInProject(userUid, projectId, product);
        res.status(204).send({});
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.post(AppSettings.RouteProductReport, async (req: ICustomRequest, res: Response) => {
    try {
        const userUid = req.userUid;
        const { projectId, product } = req.body;
        const reportData = await projectService.generateProductReport(userUid, projectId, product);
        res.status(200).send(reportData);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

export default router;
