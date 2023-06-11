export interface IVisualCrossingDailyForecastData {
    queryCost: number;
    latitude: number;
    longitude: number;
    resolvedAddress: string;
    address: string;
    timezone: string;
    tzoffset: number;
    description: string;
    days: CurrentConditions[];
    alerts: any[];
    stations: { [key: string]: Station; };
    currentConditions: CurrentConditions;
}

export interface CurrentConditions {
    datetime: string;
    datetimeEpoch: number;
    temp: number;
    feelslike: number;
    humidity: number;
    dew: number;
    precip: number;
    precipprob: number;
    snow: number;
    snowdepth: number;
    preciptype: null;
    windgust: number;
    windspeed: number;
    winddir: number;
    pressure: number;
    visibility: number;
    cloudcover: number;
    solarradiation: number;
    solarenergy: number;
    uvindex: number;
    conditions: Conditions;
    icon: Icon;
    stations: ID[] | null;
    source: Source;
    sunrise?: string;
    sunriseEpoch?: number;
    sunset?: string;
    sunsetEpoch?: number;
    moonphase?: number;
    tempmax?: number;
    tempmin?: number;
    feelslikemax?: number;
    feelslikemin?: number;
    precipcover?: number;
    severerisk?: number;
    description?: string;
    hours?: CurrentConditions[];
}

export enum Conditions {
    Clear = "Clear",
    PartiallyCloudy = "Partially cloudy",
}

export enum Icon {
    ClearDay = "clear-day",
    ClearNight = "clear-night",
    PartlyCloudyDay = "partly-cloudy-day",
    PartlyCloudyNight = "partly-cloudy-night",
}

export enum Source {
    Comb = "comb",
    Fcst = "fcst",
    Obs = "obs",
}

export enum ID {
    D8868 = "D8868",
    Kgai = "KGAI",
    Kiad = "KIAD",
    Kjyo = "KJYO",
    Va060 = "VA060",
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
