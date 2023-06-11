import Helpers from "../../shared/helpers";
import { IWeatherData } from "../../shared/interfaces";
import cloudFirestoreService from "../firebase/cloudFirestore";
import visualCrossingService from "./visualCrossing";

class Weather {
    private weatherKey = "weather";
    private weatherCollection = cloudFirestoreService.database.collection(this.weatherKey);

    async addWeatherDataInRegion(region: string, date: Date, longitiude: number, latitude: number): Promise<boolean> {
        const formattedDate = Helpers.getFormattedDate(date);
        if (await cloudFirestoreService.propertyInDocumentExists(this.weatherCollection, region, formattedDate)) {
            return false;
        }
        const response = await visualCrossingService.getTodayForecast(latitude, longitiude);
        const data: IWeatherData = { [formattedDate]: response.days[0].hours };
        cloudFirestoreService.updateDocument(this.weatherCollection, region, data);
        return true;
    }

}

export default new Weather();
