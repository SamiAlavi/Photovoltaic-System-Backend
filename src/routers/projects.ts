import { Router, Request, Response, NextFunction } from 'express';
import projectService from "../services/projectService";
import AppSettings from '../../AppSettings';
import { ICustomRequest } from '../shared/interfaces';

const router = Router();

router.get(AppSettings.RouteBase, async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const projects = await projectService.getProjects(req.userUid);
        res.send(projects);
    }
    catch (error: any) {
        // console.error('Error creating new user:', error);
        handleError(res, error);
    }
});

router.get(AppSettings.RouteId, async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const projectId = decodeURIComponent(req.params.id);
        const project = await projectService.getProject(req.userUid, projectId);
        res.send(project);
    }
    catch (error: any) {
        // console.error('Error creating new user:', error);
        handleError(res, error);
    }
});

function handleError(res: Response, error: Error) {
    res.status(400).send({
        message: error.message,
    });
}

export default router;
