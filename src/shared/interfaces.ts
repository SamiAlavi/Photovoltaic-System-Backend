import { Request } from 'express';
import { ORIENTATION } from './enums';

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
    id: string,
    name: string,
    company: string,
    area: number,
    power_peak: number,
    num_cells: string,
}

interface IProject {
    id: string,
    products: IProductDetail[],
    name?: string,
    timeCreated: number,
}


interface IProductDetail extends IProduct {
    orientation: ORIENTATION,
    tiltAngle: number,
    lat: number,
    lng: number,
    timestamp: number,
    region: string,
}


export {
    ICustomUserRecord,
    ICustomRequest,
    IProject,
    IProduct,
    IProductDetail,
};
