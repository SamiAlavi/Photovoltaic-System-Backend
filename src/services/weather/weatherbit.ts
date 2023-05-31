import axios from "axios";
import environment from "../../../env";
import Helpers from "../../helpers";
import { IWeather, IWeatherbitRequest } from "./interfaces";

class Weatherbit implements IWeather {
    API_KEY = environment.APIKEY_WEATHERBIT;
    baseUrl = "https://api.weatherbit.io/v2.0/current";

    async getCurrentWeatherData(latitude: number, longitude: number, numDays = 1) {
        try {
            const queryParams: IWeatherbitRequest = {
                lat: latitude,
                lon: longitude,
                key: this.API_KEY,
                cnt: numDays,
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

export default new Weatherbit();
