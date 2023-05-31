enum ResponseFormat {
    JSON = "json",
    XML = "xml",
    HTML = "html",
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

interface IWeather {
    API_KEY: string;
    baseUrl: string;

    getCurrentWeatherData(latitude: number, longitude: number): Promise<any>;
}

interface IWeatherRequest {
    lat: number,
    lon: number,
    lang?: string, // language code, default en
}

interface IOpenWeatherMapRequest extends IWeatherRequest {
    appid: string,
    cnt: number, // [1, 16]
    mode?: ResponseFormat, // default json
    units?: MeasurementUnitOpenWeatherMap, // default standard
}

interface IWeatherbitRequest extends IWeatherRequest {
    key: string,
    cnt: number, // [1, 16], default 16
    units?: MeasurementUnitWeatherbit, // default metric
}

export { IWeather, IOpenWeatherMapRequest, IWeatherbitRequest };
