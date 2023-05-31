enum ResponseFormat {
    JSON = "json",
    XML = "xml",
    HTML = "html",
}

enum MeasurementUnit {
    STANDARD = "standard",
    METRIC = "metric",
    IMPERIAL = "imperial",
}

interface IWeather {
    API_KEY: string;
    baseUrl: string;

    getCurrentWeatherData(latitude: number, longitude: number): Promise<any>;
}

interface IOpenWeatherMapRequest {
    lat: number,
    lon: number,
    appid: string,
    cnt: number, // [1, 16]
    mode?: ResponseFormat, // default json
    units?: MeasurementUnit, // default standard
    lang?: string, // language code
}

export { IWeather, IOpenWeatherMapRequest };
