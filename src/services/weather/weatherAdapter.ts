import openWeatherMapService from './openWeatherMap';
import visualCrossingService from './visualCrossing';

class WeatherAdapter {

    async getCurrentWeatherData(latitude: number, longitude: number) {
        return await openWeatherMapService.getCurrentWeatherData(latitude, longitude);
    }

    async getTodayForecastData(latitude: number, longitude: number) {
        return await openWeatherMapService.get3HourForecastData(latitude, longitude);
    }

    async getLast30DaysWeather(latitude: number, longitude: number) {
        return await visualCrossingService.getLast30DaysWeather(latitude, longitude);
    }
}

export default new WeatherAdapter();
