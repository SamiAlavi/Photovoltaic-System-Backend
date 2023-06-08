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
    name: string,
    company: string,
    area: number,
    power_peak: number,
    num_cells: string,
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
    IProduct,
};
