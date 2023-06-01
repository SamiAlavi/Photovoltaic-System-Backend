import { ResponseFormat, MeasurementUnitOpenWeatherMap, MeasurementUnitWeatherbit, MeasurementUnitVisualCrossing } from "./enums";

interface IWeather {
    API_KEY: string;
    baseUrl: string;

    getCurrentWeatherData(latitude: number, longitude: number): Promise<any>;
}

interface IWeatherRequest {
    lang?: string, // language code, default en
}

interface IOpenWeatherMapRequest extends IWeatherRequest {
    lat: number,
    lon: number,
    appid: string,
    cnt: number, // [1, 16]
    mode?: ResponseFormat, // default json
    units?: MeasurementUnitOpenWeatherMap, // default standard
}

interface IWeatherbitRequest extends IWeatherRequest {
    lat: number,
    lon: number,
    key: string,
    cnt: number, // [1, 16], default 16
    units?: MeasurementUnitWeatherbit, // default metric
}

interface IVisualCrossingRequest extends IWeatherRequest {
    key: string,
    unitGroup: MeasurementUnitVisualCrossing,
    contentType: ResponseFormat.CSV | ResponseFormat.JSON, // default csv
    dayStartTime: "0:0:00",
    dayEndTime: "0:0:00",
    aggregateHours: 24,
    period: "last30days",
    location: string,
    extendedStats: boolean,
}

export {
    IWeather,
    IOpenWeatherMapRequest,
    IWeatherbitRequest,
    IVisualCrossingRequest,
};
