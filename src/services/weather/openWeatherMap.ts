import axios from "axios";
import enviroment from '../../../env';
import Helpers from "../../helpers";
import { IWeather, IOpenWeatherMapRequest } from './interfaces';

class OpenWeatherMap implements IWeather {
    API_KEY = enviroment.APIKEY_OPENWEATHERMAP;
    baseUrl = "https://api.openweathermap.org/data/2.5/";
    private threeHourForecastUrl = `${this.baseUrl}forecast`;
    private dailyForecastUrl = `${this.threeHourForecastUrl}/daily`;


    async getCurrentWeatherData(latitude: number, longitude: number, numDays = 1) {
        try {
            const queryParams: IOpenWeatherMapRequest = {
                lat: latitude,
                lon: longitude,
                appid: this.API_KEY,
                cnt: numDays,
            };
            const query = Helpers.getQueryParameters(queryParams);
            const requestUrl = `${this.dailyForecastUrl}?${query}`;
            const response = await axios.get(requestUrl);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }

    async get3HourForecastData(latitude: number, longitude: number, numTimestamps = 9) {
        try {
            const queryParams: IOpenWeatherMapRequest = {
                lat: latitude,
                lon: longitude,
                appid: this.API_KEY,
                cnt: numTimestamps,
            };
            const query = Helpers.getQueryParameters(queryParams);
            const requestUrl = `${this.threeHourForecastUrl}?${query}`;
            const response = await axios.get(requestUrl);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
}

export default new OpenWeatherMap();
