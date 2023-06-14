import { Router, Request, Response } from 'express';
import firebaseAuth from '../services/firebase/firebaseAuth';
import { Mapper } from '../shared/mappers';
import environment from '../../env';
import sessionManagerService from '../services/sessionManager';
import projectService from "../services/projectService";
import AppSettings from '../../AppSettings';
import { ICustomRequest } from '../shared/interfaces';
const jwt = require('jsonwebtoken');

const router = Router();
const secret = environment.SESSION_SECRET;
const expiry = { expiresIn: `${environment.SESSION_TIMEOUT}ms` };

router.post(AppSettings.RouteSignup, async (req: Request, res: Response) => {
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

router.post(AppSettings.RouteSignin, async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await firebaseAuth.loginEmailPasswordBasedAccount(email, password);
        const userRecord = Mapper.mapUserRecord(user);
        const accessToken = jwt.sign(userRecord, secret, expiry);
        userRecord.accessToken = accessToken;
        sessionManagerService.setSession(userRecord);
        res.send(userRecord);
    }
    catch (error: any) {
        // console.error('Error logging in:', error);
        handleError(res, error);
    }
});


router.delete(AppSettings.RouteSignout, async (req: ICustomRequest, res: Response) => {
    try {
        sessionManagerService.deleteSession(req.userUid);
    }
    catch {
    }
    res.sendStatus(204);
});

router.post(AppSettings.Profile, async (req: ICustomRequest, res: Response) => {
    try {
        const userUid = req.userUid;
        const { email, currentPassword, newPassword } = req.body;
        await firebaseAuth.updateUserPassword(userUid, email, currentPassword, newPassword);
        res.status(200).send({});
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
