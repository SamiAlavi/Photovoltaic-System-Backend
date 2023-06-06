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
    userUid: string,
}

interface Product {
    [key: string]: any,
}

interface Project {
    id: string,
    name: string,
    products: Product[],
}


export {
    UserImp,
    CustomUserRecord,
    CustomRequest,
    Project,
};
