import { NextFunction } from "express";
import environment from "../../env";
import sessionManager from "../services/sessionManager";
import { ICustomUserRecord } from "../shared/interfaces";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import AppSettings from "../../AppSettings";
import { ICustomRequest } from "../shared/requestsInterfaces";
import { IErrorResponse } from "../shared/responsesInterfaces";

const secret = environment.SESSION_SECRET;

const skipPaths = [
    AppSettings.RouteBase,
    AppSettings.RouteSwagger,
    AppSettings.RouteSwaggerJSON,
    `${AppSettings.RouteApi}${AppSettings.RouteSignin}`,
    `${AppSettings.RouteApi}${AppSettings.RouteSignup}`
];

// Firebase Authentication middleware
const authenticate = async (req: ICustomRequest, res: IErrorResponse, next: NextFunction) => {
    const reqPath = req.path;
    if (skipPaths.includes(reqPath) || reqPath.startsWith(AppSettings.RouteSwagger)) {
        next();
        return;
    }
    // Extract the JWT token from the request headers or cookies
    const reqHeaders = req.headers;
    const token = reqHeaders.authorization?.split(' ').at(-1) ?? "";
    const userUid = reqHeaders['x-uid'] as string;

    req.userUid = userUid;
    if (reqPath === `${AppSettings.RouteApi}${AppSettings.RouteSignout}`) {
        next();
        return;
    }

    if (!token) {
        return res.status(401).json({ message: 'Missing token' });
    }

    try {

        // Verify the token using your secret key or public key
        const decoded = jwt.verify(token, secret) as ICustomUserRecord;
        const document: ICustomUserRecord = await sessionManager.getSession(userUid);
        const isSameUser = userUid === decoded.uid && userUid === document.uid;
        const isSameToken = token === document.accessToken;
        if (!(isSameUser && isSameToken)) {
            return res.status(403).json({ message: 'Token is not for the same user' });
        }
        next();
    } catch (error: any) {
        let message = 'Invalid token';
        if (error instanceof TokenExpiredError) {
            const { uid } = jwt.decode(token) as ICustomUserRecord;
            sessionManager.deleteSession(uid);
            message = 'Session Expired. Please signin again.';
        }
        return res.status(401).json({ message: message });
    }
};

export default authenticate;
