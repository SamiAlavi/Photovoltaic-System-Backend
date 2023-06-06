import { User } from "firebase/auth";
import { Request } from 'express';

interface UserImp extends User {
    accessToken?: string,
}

interface CustomUserRecord {
    uid: string,
    email: string,
    accessToken?: string,
    exp?: number,
}

interface CustomRequest extends Request {
    auth?: any;
}


export {
    UserImp,
    CustomUserRecord,
    CustomRequest,
};
