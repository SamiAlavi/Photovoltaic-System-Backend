export interface IVisualCrossingDailyForecastData {
    queryCost: number;
    latitude: number;
    longitude: number;
    resolvedAddress: string;
    address: string;
    timezone: string;
    tzoffset: number;
    days: Day[];
    stations: { [key: string]: Station; };
}

export interface WeatherData {
    datetime: Date;
    datetimeEpoch: number;
    temp: number;
    feelslike: number;
    dew: number;
    humidity: number;
    precip: number;
    precipprob: number;
    snow: number;
    snowdepth: number;
    preciptype?: Icon[];
    windgust: number;
    windspeed: number;
    winddir: number;
    pressure: number;
    visibility: number;
    cloudcover: number;
    solarradiation: number;
    solarenergy: number;
    uvindex: number;
    severerisk: number;
    conditions: Conditions;
    icon: Icon;
    stations: ID[];
    source: Source;
}

export interface Day extends WeatherData {
    tempmax: number;
    tempmin: number;
    feelslikemax: number;
    feelslikemin: number;
    precipcover: number;
    sunrise: string;
    sunriseEpoch: number;
    sunset: string;
    sunsetEpoch: number;
    moonphase: number;
    description: string;
    hours: Hour[];
}

export enum Conditions {
    Overcast = "Overcast",
    PartiallyCloudy = "Partially cloudy",
    RainOvercast = "Rain, Overcast",
    RainPartiallyCloudy = "Rain, Partially cloudy",
}

export interface Hour extends WeatherData {
    conditions: Conditions;
}

export enum Icon {
    Cloudy = "cloudy",
    PartlyCloudyDay = "partly-cloudy-day",
    PartlyCloudyNight = "partly-cloudy-night",
    Rain = "rain",
}

export enum Source {
    Obs = "obs",
}

export enum ID {
    D8868 = "D8868",
    Kdaa = "KDAA",
    Kdca = "KDCA",
    Kgai = "KGAI",
    Khef = "KHEF",
    Kiad = "KIAD",
    Kjyo = "KJYO",
}

export interface Station {
    distance: number;
    latitude: number;
    longitude: number;
    useCount: number;
    id: ID;
    name: string;
    quality: number;
    contribution: number;
}
