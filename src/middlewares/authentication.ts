import { Request, Response, NextFunction } from "express";
import admin from 'firebase-admin';
import { firebaseAdminApp } from '../services/firebase/firebase';

const auth = admin.auth(firebaseAdminApp);

// Firebase Authentication middleware
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/signin') {
        next();
        return;
    }

    try {
        const session = (req.session as any).user;
        if (!session || !session.user) {
            // User is not authenticated, redirect to sigin page or handle the unauthorized access
            return res.redirect('/signin');
        }

        // Retrieve the user from Firebase Authentication
        const userId = session.user.uid;
        const user = await auth.getUser(userId);

        // Attach the user object to the request for further processing
        (req as any).user = user;

        next();
    } catch (error) {
        // Handle the error
        console.error('Firebase Authentication Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default authenticate;
