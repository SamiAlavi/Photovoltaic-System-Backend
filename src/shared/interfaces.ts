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
    products: IProduct[],
    name?: string,
    timeCreated: number,
}


export {
    ICustomUserRecord,
    ICustomRequest,
    IProject,
};
