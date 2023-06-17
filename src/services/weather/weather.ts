import Helpers from "../../shared/helpers";
import { IReportData, IWeatherData } from "../../shared/interfaces";
import cloudFirestoreService from "../firebase/cloudFirestore";
import visualCrossingService from "./visualCrossing";

class Weather {
    private weatherKey = "weather";
    private weatherCollection = cloudFirestoreService.database.collection(this.weatherKey);

    async addTodayWeatherDataInRegion(region: string, longitiude: number, latitude: number): Promise<boolean> {
        const formattedDate = Helpers.getFormattedDate(new Date());
        if (await cloudFirestoreService.propertyInDocumentExists(this.weatherCollection, region, formattedDate)) {
            return false;
        }
        const response = await visualCrossingService.getTodayForecast(latitude, longitiude);
        const data: IWeatherData = { [formattedDate]: response.days[0].hours };
        cloudFirestoreService.updateDocument(this.weatherCollection, region, data);
        return true;
    }

    async addLast30DaysDataInRegion(region: string, longitiude: number, latitude: number): Promise<void> {
        const date = new Date();
        const last30days = 1;
        const step = 1;
        for (let i = 1; i <= last30days; i++) {
            date.setDate(date.getDate() - step);
            const formattedDate = Helpers.getFormattedDate(date);
            const weatherDataExists = await cloudFirestoreService.propertyInDocumentExists(this.weatherCollection, region, formattedDate);
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

}

export default new Weather();
