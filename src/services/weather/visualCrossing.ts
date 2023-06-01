import axios from "axios";
import enviroment from '../../../env';
import Helpers from "../../helpers";
import { IWeather, IVisualCrossingRequest } from './interfaces';
import { MeasurementUnitVisualCrossing, ResponseFormat } from "./enums";

class VisualCrossing implements IWeather {
    API_KEY = enviroment.APIKEY_VISUALCROSSING;
    baseUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history/";

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
}

export default new VisualCrossing();
