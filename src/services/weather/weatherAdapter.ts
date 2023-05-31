import openWeatherMapService from './openWeatherMap';

class WeatherAdapter {

    async getWeatherData(latitude: number, longitude: number) {
        return await openWeatherMapService.getWeatherData(latitude, longitude);
    }
}

export default new WeatherAdapter();
