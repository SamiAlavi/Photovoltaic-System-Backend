import { Router } from 'express';
import firebaseAuth from '../services/firebase/firebaseAuth';
import { Mapper } from '../shared/mappers';
import environment from '../../env';
import sessionManagerService from '../services/sessionManager';
import projectService from "../services/projectService";
import AppSettings from '../../AppSettings';
import { ICustomRequest, IProfileDeleteRequest, IProfileUpdateRequest, ISigninRequest, ISignupRequest } from '../shared/requestsInterfaces';
import Helpers from '../shared/helpers';
import { ISignupResponse, ISigninResponse, IProfileDeleteResponse, ISignoutResponse, IProfileUpdateResponse } from '../shared/responsesInterfaces';
const jwt = require('jsonwebtoken');

const router = Router();
const secret = environment.SESSION_SECRET;
const expiry = { expiresIn: `${environment.SESSION_TIMEOUT}ms` };

router.post(AppSettings.RouteSignup, async (req: ISignupRequest, res: ISignupResponse) => {
    try {
        const { email, password } = req.body;
        const user = await firebaseAuth.createEmailPasswordBasedAccount(email, password);
        projectService.initProject(user.uid);
        const mappedUserDetails = Mapper.mapUserRecord(user);
        res.json(mappedUserDetails);
    }
    catch (error: any) {
        // console.error('Error creating new user:', error);
        Helpers.handleError(res, error);
    }
});

router.post(AppSettings.RouteSignin, async (req: ISigninRequest, res: ISigninResponse) => {
    try {
        const { email, password } = req.body;
        const user = await firebaseAuth.loginEmailPasswordBasedAccount(email, password);
        const userRecord = Mapper.mapUserRecord(user);
        const accessToken = jwt.sign(userRecord, secret, expiry);
        userRecord.accessToken = accessToken;
        sessionManagerService.setSession(userRecord);
        res.json(userRecord);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});


router.delete(AppSettings.RouteSignout, async (req: ICustomRequest, res: ISignoutResponse) => {
    try {
        const userUid = req.userUid;
        sessionManagerService.deleteSession(userUid);
        res.status(204).json({ message: 'Success' });
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.put(AppSettings.Profile, async (req: IProfileUpdateRequest, res: IProfileUpdateResponse) => {
    try {
        const userUid = req.userUid;
        const { email, currentPassword, newPassword } = req.body;
        await firebaseAuth.updateUserPassword(userUid, email, currentPassword, newPassword);
        res.status(200).json({ message: 'Success' });
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

router.delete(AppSettings.Profile, async (req: ICustomRequest, res: IProfileDeleteResponse) => {
    try {
        const userUid = req.userUid;
        //const { email, currentPassword } = req.body;
        await firebaseAuth.deleteUser(userUid);
        await sessionManagerService.deleteSession(userUid);
        await projectService.deleteAllProjects(userUid);
        res.status(204).json({ message: "Success" });
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

export default router;
