import axios from "axios";
import Helpers from "../../shared/helpers";
import environment from "../../../env";
import { IAccuWeatherDailyForecastData } from "./interfaces-accuWeather";

class AccuWeather {
    private baseUrl = "http://dataservice.accuweather.com/";
    private geopositionUrl = `${this.baseUrl}locations/v1/cities/geoposition/search`;
    private dailyForecastUrl = `${this.baseUrl}forecasts/v1/daily/1day/`;

    private async getLocationKey(latitude: number, longitiude: number): Promise<string> {
        const queryParams = {
            q: `${latitude}%2C${longitiude}`,
            apikey: environment.APIKEY_ACCUWEATHER,
        };
        const query = Helpers.getQueryParameters(queryParams);
        const requestUrl = `${this.geopositionUrl}?${query}`;
        const response = await axios.get(requestUrl);
        if (response?.data) {
            return response.data['Key'];
        }
        return;
    }

    async getTodayForecast(latitude: number, longitiude: number): Promise<IAccuWeatherDailyForecastData | undefined> {
        const locationKey = await this.getLocationKey(latitude, longitiude);
        if (!locationKey) {
            return;
        }
        const queryParams = {
            details: true,
            apikey: environment.APIKEY_ACCUWEATHER,
        };
        const query = Helpers.getQueryParameters(queryParams);
        const requestUrl = `${this.dailyForecastUrl}${locationKey}?${query}`;
        const response = await axios.get(requestUrl);
        if (response?.data) {
            return response.data;
        }
        return;
    }
}

export default new AccuWeather();
