import { Request, Response, NextFunction } from "express";
import environment from "../../env";
import sessionManager from "../services/sessionManager";
import { CustomUserRecord } from "../shared/interfaces";
import jwt, { TokenExpiredError } from "jsonwebtoken";

const secret = environment.SESSION_SECRET;

// Firebase Authentication middleware
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/signin') {
        next();
        return;
    }
    // Extract the JWT token from the request headers or cookies
    const token = req.headers.authorization?.split(' ').at(-1) ?? "";
    const userUid = req.headers['x-uid'] as string;

    if (!token) {
        return res.status(401).json({ message: 'Missing token' });
    }

    try {
        // Verify the token using your secret key or public key
        const decoded = jwt.verify(token, secret) as CustomUserRecord;
        const document: CustomUserRecord = await sessionManager.getSession(userUid);
        const isSameUser = userUid === decoded.uid && userUid === document.uid;
        const isSameToken = token === document.accessToken;
        if (!(isSameUser && isSameToken)) {
            return res.status(403).json({ message: 'Token is not for the same user' });
        }
        next();
    } catch (error: any) {
        let message = 'Invalid token';
        if (error instanceof TokenExpiredError) {
            const { uid } = jwt.decode(token) as CustomUserRecord;
            sessionManager.deleteSession(uid);
            message = 'Session Expired. Please signin again.';
        }
        return res.status(401).json({ message: message });
    }
};

export default authenticate;
