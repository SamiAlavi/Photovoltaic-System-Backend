import openWeatherMapService from './openWeatherMap';

class WeatherAdapter {

    async getCurrentWeatherData(latitude: number, longitude: number) {
        return await openWeatherMapService.getCurrentWeatherData(latitude, longitude);
    }
}

export default new WeatherAdapter();
