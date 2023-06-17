export interface IVisualCrossingDailyForecastData {
    queryCost: number;
    latitude: number;
    longitude: number;
    resolvedAddress: string;
    address: string;
    timezone: string;
    tzoffset: number;
    days: CurrentConditions[];
}

export interface CurrentConditions {
    datetime: string;
    solarradiation: number;
    hours?: CurrentConditions[];
}
