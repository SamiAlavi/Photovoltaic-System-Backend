import axios from "axios";
import enviroment from '../../../env';
import Helpers from "../../shared/helpers";
import { IVisualCrossingDailyForecastData } from "./interface-visualCrossing";

class VisualCrossing {
    private readonly API_KEY = enviroment.APIKEY_VISUALCROSSING;
    private readonly baseUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/";
    private readonly timelineUrl = `${this.baseUrl}timeline/`;

    async getTodayForecast(latitude: number, longitiude: number): Promise<IVisualCrossingDailyForecastData> {
        const currentDate = new Date();
        const response = await this.getDateTimeline(latitude, longitiude, currentDate);
        return response;
    }

    async getDateTimeline(latitude: number, longitiude: number, date: Date): Promise<IVisualCrossingDailyForecastData> {
        const response = await this.getTimeline(latitude, longitiude, date, date);
        return response;
    }

    private async getTimeline(latitude: number, longitiude: number, fromDate: Date, toDate: Date): Promise<IVisualCrossingDailyForecastData> {
        const formattedFromDate = Helpers.getFormattedDate(fromDate);
        const formattedToDate = Helpers.getFormattedDate(toDate);

        const queryParams = {
            key: this.API_KEY,
            include: "hours", //days,hours
            elements: "datetime,solarradiation",
            options: "noheaders,nonulls",
        };
        const query = Helpers.getQueryParameters(queryParams);

        const requestUrl = `${this.timelineUrl}${latitude},${longitiude}/${formattedFromDate}/${formattedToDate}?${query}`;
        const response = await axios.get(requestUrl);
        if (response?.data) {
            return response.data;
        }
        return;
    }
}

export default new VisualCrossing();
