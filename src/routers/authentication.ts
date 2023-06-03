import { Router, Request, Response } from 'express';
import firebaseAuth from '../services/firebase/firebaseAuth';
import { Mapper } from '../shared/mappers';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await firebaseAuth.createEmailPasswordBasedAccount(email, password);
    const mappedUserDetails = Mapper.mapUserRecord(user);
    res.send(mappedUserDetails);
});

router.post('/signin', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await firebaseAuth.loginEmailPasswordBasedAccount(email, password);
    const mappedUserDetails = Mapper.mapUserRecord(user);
    res.send(mappedUserDetails);
});

export default router;
