enum ResponseFormat {
    JSON = "json",
    XML = "xml",
}

enum MeasurementUnit {
    STANDARD = "standard",
    METRIC = "metric",
    IMPERIAL = "imperial",
}

interface IWeather {
    API_KEY: string;
    baseUrl: string;

    getWeatherData(latitude: number, longitude: number): Promise<any>;
}

interface IWeatherRequest {
    lat: number,
    lon: number,
    appid: string,
    cnt?: number, // [1, 30],
    mode?: ResponseFormat, // default json
    units?: MeasurementUnit, // default standard
    lang?: string, // language code
}

export { IWeather, IWeatherRequest };
