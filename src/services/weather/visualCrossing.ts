import axios from "axios";
import enviroment from '../../../env';
import Helpers from "../../shared/helpers";
import { IWeather, IVisualCrossingRequest } from './interfaces';
import { MeasurementUnitVisualCrossing, ResponseFormat } from "./enums";
import { IVisualCrossingDailyForecastData } from "./interface-visualCrossing";

class VisualCrossing {
    private readonly API_KEY = enviroment.APIKEY_VISUALCROSSING;
    private readonly baseUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/";
    private readonly historyUrl = `${this.baseUrl}weatherdata/history/`;
    private readonly timelineUrl = `${this.baseUrl}timeline/`;

    async getCurrentWeatherData(latitude: number, longitude: number, numDays = 1) {
    }

    async getLast30DaysWeather(latitude: number, longitude: number) {
        try {
            const location = `${latitude},${longitude}`;
            const queryParams: IVisualCrossingRequest = {
                location: location,
                key: this.API_KEY,
                unitGroup: MeasurementUnitVisualCrossing.METRIC,
                contentType: ResponseFormat.JSON,
                dayStartTime: "0:0:00",
                dayEndTime: "0:0:00",
                aggregateHours: 24,
                period: "last30days",
                extendedStats: true,
            };
            const query = Helpers.getQueryParameters(queryParams);
            const requestUrl = `${this.baseUrl}?${query}`;
            const response = await axios.get(requestUrl);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
    async getTodayForecast(latitude: number, longitiude: number): Promise<IVisualCrossingDailyForecastData> {
        const queryParams = {
            key: this.API_KEY,
        };
        const currentDate = Helpers.getFormattedDate();
        const query = Helpers.getQueryParameters(queryParams);
        const requestUrl = `${this.timelineUrl}${latitude},${longitiude}/${currentDate}/${currentDate}?${query}`;
        const response = await axios.get(requestUrl);
        if (response?.data) {
            return response.data;
        }
        return;
    }
}

export default new VisualCrossing();
