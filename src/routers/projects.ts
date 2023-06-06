import { Router, Request, Response, NextFunction } from 'express';
import projectService from "../services/projectService";
import AppSettings from '../../AppSettings';
import { CustomRequest } from '../shared/interfaces';

const router = Router();

router.get(AppSettings.RouteBase, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const projects = await projectService.getProjects(req.userUid);
        res.send(projects);
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
