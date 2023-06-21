import { Router, Response } from 'express';
import firebaseAuth from '../services/firebase/firebaseAuth';
import { Mapper } from '../shared/mappers';
import environment from '../../env';
import sessionManagerService from '../services/sessionManager';
import projectService from "../services/projectService";
import AppSettings from '../../AppSettings';
import { ICustomRequest, IProfileDeleteRequest, IProfileUpdateRequest, ISigninRequest, ISignupRequest } from '../shared/requestsInterfaces';
import Helpers from '../shared/helpers';
const jwt = require('jsonwebtoken');

const router = Router();
const secret = environment.SESSION_SECRET;
const expiry = { expiresIn: `${environment.SESSION_TIMEOUT}ms` };

router.post(AppSettings.RouteSignup, async (req: ISignupRequest, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await firebaseAuth.createEmailPasswordBasedAccount(email, password);
        projectService.initProject(user.uid);
        const mappedUserDetails = Mapper.mapUserRecord(user);
        res.send(mappedUserDetails);
    }
    catch (error: any) {
        // console.error('Error creating new user:', error);
        Helpers.handleError(res, error);
    }
});

router.post(AppSettings.RouteSignin, async (req: ISigninRequest, res: Response) => {
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
        Helpers.handleError(res, error);
    }
});


router.delete(AppSettings.RouteSignout, async (req: ICustomRequest, res: Response) => {
    try {
        const userUid = req.userUid;
        sessionManagerService.deleteSession(userUid);
        res.sendStatus(204);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.post(AppSettings.Profile, async (req: IProfileUpdateRequest, res: Response) => {
    try {
        const userUid = req.userUid;
        const { email, currentPassword, newPassword } = req.body;
        await firebaseAuth.updateUserPassword(userUid, email, currentPassword, newPassword);
        res.status(200).send({});
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.delete(AppSettings.Profile, async (req: IProfileDeleteRequest, res: Response) => {
    try {
        const userUid = req.userUid;
        const { email, currentPassword } = req.body;
        await firebaseAuth.deleteUser(userUid, email);
        await sessionManagerService.deleteSession(userUid);
        await projectService.deleteAllProjects(userUid);
        res.status(204).send({});
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

export default router;
