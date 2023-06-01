enum ResponseFormat {
    JSON = "json",
    XML = "xml",
    HTML = "html",
    CSV = "csv",
}

enum MeasurementUnitOpenWeatherMap {
    STANDARD = "standard",
    METRIC = "metric",
    IMPERIAL = "imperial",
}

enum MeasurementUnitWeatherbit {
    METRIC = "M", // Metric (Celsius, m/s, mm)
    SCIENTIFIC = "S", // Scientific (Kelvin, m/s, mm)
    Farenheit = "I", // Fahrenheit (F, mph, in)
}

enum MeasurementUnitVisualCrossing {
    US = "us", // F, mph, in
    METRIC = "metric", // Celsius, km/hr, mm
    UK = "uk", // Celsius, miles/hr, mm
    BASE = "base", // Kelvin, m/s, mm
}

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

export { IWeather, IOpenWeatherMapRequest, IWeatherbitRequest, IVisualCrossingRequest, MeasurementUnitVisualCrossing, ResponseFormat };
