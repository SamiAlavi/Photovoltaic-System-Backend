import { Request } from 'express';
import { ORIENTATION } from './enums';
import { CurrentConditions, IVisualCrossingDailyForecastData } from '../services/weather/interface-visualCrossing';

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
    model: string,
    company: string,
    area: number,
    power_peak: number,
    num_cells: string,
}

interface IProject {
    id: string,
    products: IProductDetail[],
    timeCreated: number,
    isActive: boolean,
}


interface IProductDetail extends IProduct {
    name: string,
    orientation: ORIENTATION,
    tiltAngle: number,
    lat: number,
    lng: number,
    timestamp: number,
    region: string,
    isActive: boolean,
    num_panels: number,
    report?: IReportData,
}

interface IProjectCollection {
    collectionId: string,
    documents: IProject[],
}

interface IAddProductRequest {
    projectId: string,
    product: IProductDetail,
}

interface IWeatherData {
    [key: string]: CurrentConditions[];
}

interface IReportDataRow {
    datetime: string,
    solarradiation: number,
    electricityGenerated?: number,
}

interface IReportData {
    [key: string]: IReportDataRow[],
}


export {
    ICustomUserRecord,
    ICustomRequest,
    IProject,
    IProduct,
    IProductDetail,
    IProjectCollection,
    IAddProductRequest,
    IWeatherData,
    IReportDataRow,
    IReportData,
};
