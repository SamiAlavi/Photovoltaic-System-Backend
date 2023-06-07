import { Request } from 'express';

interface ICustomUserRecord {
    uid: string,
    email: string,
    accessToken?: string,
    exp?: number,
}

interface ICustomRequest extends Request {
    userUid: string,
}

interface IProduct {
    [key: string]: any,
}

interface IProject {
    id: string,
    name: string,
    products: IProduct[],
}


export {
    ICustomUserRecord,
    ICustomRequest,
    IProject,
};
