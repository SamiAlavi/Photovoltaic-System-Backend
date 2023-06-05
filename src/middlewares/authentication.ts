import { Request, Response, NextFunction } from "express";
import admin from 'firebase-admin';
import { firebaseAdminApp } from '../services/firebase/firebase';
import environment from "../../env";
import sessionManager from "../services/firebase/sessionManager";
import { CustomUserRecord } from "../shared/interfaces";
const jwt = require('jsonwebtoken');

const auth = admin.auth(firebaseAdminApp);
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
        const user: CustomUserRecord = jwt.verify(token, secret);
        const document: CustomUserRecord = await sessionManager.getSession(userUid);
        if (token !== document.accessToken) {
            return res.status(403).json({ message: 'Token is not for the same user' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authenticate;
