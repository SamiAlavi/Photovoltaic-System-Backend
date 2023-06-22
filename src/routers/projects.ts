import { Router, Response } from 'express';
import projectService from "../services/projectService";
import AppSettings from '../../AppSettings';
import { ICustomRequest, IProductAddRequest, IProductDeleteRequest, IProductReportGenerateRequest, IProductUpdateRequest, IProjectCreateRequest, IProjectDeleteRequest } from '../shared/requestsInterfaces';
import Helpers from '../shared/helpers';
import { IProductAddResponse, IProductDeleteResponse, IProductReportGenerateResponse, IProductUpdateResponse, IProjectCreateResponse, IProjectDeleteResponse, IProjectsGetResponse } from '../shared/responsesInterfaces';

const router = Router();

router.get(AppSettings.RouteBase, async (req: ICustomRequest, res: IProjectsGetResponse) => {
    try {
        const userUid = req.userUid;
        const projects = await projectService.getProjects(userUid);
        res.json(projects);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.post(AppSettings.RouteBase, async (req: IProjectCreateRequest, res: IProjectCreateResponse) => {
    try {
        const userUid = req.userUid;
        const { projectId } = req.body;
        const project = projectService.createProject(userUid, projectId);
        res.status(201).json(project);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.delete(AppSettings.RouteBase, async (req: IProjectDeleteRequest, res: IProjectDeleteResponse) => {
    try {
        const userUid = req.userUid;
        const { projectId } = req.body;
        projectService.deleteProject(userUid, projectId);
        res.status(204).json(true);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.post(AppSettings.RouteAddEditDeleteProduct, async (req: IProductAddRequest, res: IProductAddResponse) => {
    try {
        const userUid = req.userUid;
        const { projectId, product } = req.body;
        projectService.addProductInProject(userUid, projectId, product);
        res.status(201).json({ message: "Success" });
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.put(AppSettings.RouteAddEditDeleteProduct, async (req: IProductUpdateRequest, res: IProductUpdateResponse) => {
    try {
        const userUid = req.userUid;
        const { projectId, product } = req.body;
        projectService.editProductInProject(userUid, projectId, product);
        res.status(204).json({ message: "Success" });
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.delete(AppSettings.RouteAddEditDeleteProduct, async (req: IProductDeleteRequest, res: IProductDeleteResponse) => {
    try {
        const userUid = req.userUid;
        const { projectId, product } = req.body;
        projectService.deleteProductInProject(userUid, projectId, product);
        res.status(204).json({ message: "Success" });
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.post(AppSettings.RouteProductReport, async (req: IProductReportGenerateRequest, res: IProductReportGenerateResponse) => {
    try {
        const userUid = req.userUid;
        const { projectId, product } = req.body;
        const reportData = await projectService.generateProductReport(userUid, projectId, product);
        res.status(200).json(reportData);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

export default router;
