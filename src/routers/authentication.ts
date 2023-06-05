import { Router, Request, Response, NextFunction } from 'express';
import firebaseAuth from '../services/firebase/firebaseAuth';
import { Mapper } from '../shared/mappers';
import { FirebaseError } from 'firebase-admin';

const router = Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await firebaseAuth.createEmailPasswordBasedAccount(email, password);
        const mappedUserDetails = Mapper.mapUserRecord(user);
        res.send(mappedUserDetails);
    }
    catch (error: any) {
        // console.error('Error creating new user:', error);
        handleError(res, error);
    }
});

router.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await firebaseAuth.loginEmailPasswordBasedAccount(email, password);
        const mappedUserDetails = Mapper.mapUserRecord(user);
        (req.session as any).user = user;
        res.send(mappedUserDetails);
    }
    catch (error: any) {
        // console.error('Error logging in:', error);
        handleError(res, error);
    }
});


router.get('/signout', async (req: Request, res: Response) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Session Destroy Error:', error);
        }
        res.redirect('/');
    });
});

function handleError(res: Response, error: Error) {
    res.status(400).send({
        message: error.message,
    });
}

export default router;
