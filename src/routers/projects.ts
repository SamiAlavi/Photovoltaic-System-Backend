import { Router, Response } from 'express';
import projectService from "../services/projectService";
import AppSettings from '../../AppSettings';
import { ICustomRequest, IProductDetail, IProject } from '../shared/interfaces';

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
        const projectId: string = req.body.id;
        const project = projectService.createProject(req.userUid, projectId);
        res.status(201).send(project);
    }
    catch (error: any) {
        handleError(res, error);
    }
});

router.post(AppSettings.RouteAddProduct, async (req: ICustomRequest, res: Response) => {
    try {
        const project: IProject = req.body;
        projectService.updateProject(req.userUid, project);
        res.status(201).send(project);
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
