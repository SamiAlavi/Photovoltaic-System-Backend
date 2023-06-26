import Helpers from "../../shared/helpers";
import { IReportData, IWeatherData } from "../../shared/interfaces";
import cloudFirestoreService from "../firebase/cloudFirestore";
import visualCrossingService from "./visualCrossing";

class Weather {
    private weatherKey = "weather";
    private weatherCollection = cloudFirestoreService.database.collection(this.weatherKey);

    private async weatherDataExists(region: string, formattedDate: string): Promise<boolean> {
        try {
            const weatherDataKeys = await this.getWeatherDataKeys(region);
            const weatherDataExists = weatherDataKeys.includes(formattedDate);
            return weatherDataExists;
        }
        catch (error: any) {
            return false;
        }
    }

    async addTodayWeatherDataInRegion(region: string, longitiude: number, latitude: number): Promise<boolean> {
        const formattedDate = Helpers.getFormattedDate(new Date());
        const weatherDataExists = await this.weatherDataExists(region, formattedDate);
        if (weatherDataExists) {
            return false;
        }
        const response = await visualCrossingService.getTodayForecast(latitude, longitiude);
        const data: IWeatherData = { [formattedDate]: response.days[0].hours };
        cloudFirestoreService.updateDocument(this.weatherCollection, region, data);
        return true;
    }

    async addLast30DaysDataInRegion(region: string, longitiude: number, latitude: number): Promise<void> {
        const date = new Date();
        const last30days = 30;
        const step = 1;
        const weatherDataKeys = await this.getWeatherDataKeys(region);
        for (let i = 1; i <= last30days; i++) {
            date.setDate(date.getDate() - step);
            const formattedDate = Helpers.getFormattedDate(date);
            const weatherDataExists = weatherDataKeys.includes(formattedDate);
            if (weatherDataExists) {
                continue;
            }
            const response = await visualCrossingService.getDateTimeline(latitude, longitiude, date);
            const data: IWeatherData = { [formattedDate]: response.days[0].hours };
            cloudFirestoreService.updateDocument(this.weatherCollection, region, data);
        }
    }

    async getWeatherData(region: string): Promise<IReportData> {
        const weatherDocument = await cloudFirestoreService.getDocument(this.weatherCollection, region);
        return weatherDocument;
    }

    async getWeatherDataKeys(region: string): Promise<string[]> {
        return Object.keys(await this.getWeatherData(region));
    }

    async getWeatherCollectionIds(): Promise<string[]> {
        const weatherIds = await cloudFirestoreService.getDocumentsIds(this.weatherCollection);
        return weatherIds;
    }

    async deleteWeatherDateData(documentId: string, date: Date) {
        const formattedDate = Helpers.getFormattedDate(date);
        const document: IWeatherData = await cloudFirestoreService.getDocument(this.weatherCollection, documentId);
        delete document[formattedDate];
        return cloudFirestoreService.setDocument(this.weatherCollection, documentId, document);
    }

    async getLast30DaysWeatherData(region: string): Promise<IReportData> {
        const reportData: IReportData = {};
        const weatherDocument = await this.getWeatherData(region);
        const date = new Date();
        const last30days = 30;
        const step = 1;
        for (let i = 1; i <= last30days; i++) {
            date.setDate(date.getDate() - step);
            const formattedDate = Helpers.getFormattedDate(date);
            reportData[formattedDate] = weatherDocument[formattedDate] ?? [];
        }
        return reportData;
    }

    async getCurrentTimeWeatherIcon(region: string): Promise<string> {
        const date = new Date();
        const formattedDate = Helpers.getFormattedDate(date);
        const formattedTime = Helpers.getFormattedTime(date);

        const weather = await this.getWeatherData(region);
        const timeWeather = weather[formattedDate].find((timeWeather) => timeWeather.datetime === formattedTime);
        const icon = timeWeather?.icon ?? '';
        return icon;
    }

}

export default new Weather();
