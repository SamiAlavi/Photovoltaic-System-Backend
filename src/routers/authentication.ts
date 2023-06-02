import { Router, Request, Response } from 'express';
import firebaseAuth from '../services/firebase/firebaseAuth';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userRecord = await firebaseAuth.createEmailPasswordBasedAccount(email, password);
    res.send(userRecord);
});

router.post('/signin', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userRecord = await firebaseAuth.loginEmailPasswordBasedAccount(email, password);
    res.send(userRecord);
});

export default router;
