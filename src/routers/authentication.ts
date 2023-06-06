import { Router, Request, Response, NextFunction } from 'express';
import firebaseAuth from '../services/firebase/firebaseAuth';
import { Mapper } from '../shared/mappers';
import environment from '../../env';
import sessionManagerService from '../services/sessionManager';
import projectService from "../services/projectService";
import AppSettings from '../../AppSettings';
import { CustomRequest } from '../shared/interfaces';
const jwt = require('jsonwebtoken');

const router = Router();
const secret = environment.SESSION_SECRET;
const expiry = { expiresIn: `${environment.SESSION_TIMEOUT}ms` };

router.post(AppSettings.RouteSignup, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await firebaseAuth.createEmailPasswordBasedAccount(email, password);
        projectService.initProject(user.uid);
        const mappedUserDetails = Mapper.mapUserRecord(user);
        res.send(mappedUserDetails);
    }
    catch (error: any) {
        // console.error('Error creating new user:', error);
        handleError(res, error);
    }
});

router.post(AppSettings.RouteSignin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await firebaseAuth.loginEmailPasswordBasedAccount(email, password);
        const userRecord = Mapper.mapUserRecord(user);
        const accessToken = jwt.sign(userRecord, secret, expiry);
        userRecord.accessToken = accessToken;
        const docId = await sessionManagerService.setSession(userRecord);
        res.send(userRecord);
    }
    catch (error: any) {
        // console.error('Error logging in:', error);
        handleError(res, error);
    }
});


router.delete(AppSettings.RouteSignout, async (req: CustomRequest, res: Response) => {
    sessionManagerService.deleteSession(req.userUid);
    res.sendStatus(204);
});

function handleError(res: Response, error: Error) {
    res.status(400).send({
        message: error.message,
    });
}

export default router;
