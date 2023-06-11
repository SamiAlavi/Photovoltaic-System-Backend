import cron from 'cron';
import { cloudFirestoreService } from './services/services';
import { IProjectCollection } from './shared/interfaces';
import accuWeatherService from './services/weather/accuWeather';

function getLatLngRegionMapping(collections: IProjectCollection[]) {
    if (!collections) {
        return;
    }
    const forwardMap: { [key: string]: string; } = {};
    const reverseMap: { [key: string]: string[]; } = {};

    for (let i = 0; i < collections.length; i++) {
        const documents = collections[i].documents;
        for (let j = 0; j < documents.length; j++) {
            const products = documents[j].products;
            for (let k = 0; k < products.length; k++) {
                const { lng, lat, region } = products[k];
                const key = `${lng},${lat}`;
                const value = region || key;
                forwardMap[key] = value;
                try {
                    reverseMap[value].push(key);
                }
                catch (error) {
                    reverseMap[value] = [key];
                }
            }
        }
    }
    return { forwardMap, reverseMap };
}

const callback = async () => {
    console.log(new Date());

    const projectsKey = "projects";
    const projectsDocument = cloudFirestoreService.database.collection(projectsKey).doc(projectsKey);
    const collections: IProjectCollection[] = await cloudFirestoreService.getAllCollectionsDataInDocument(projectsDocument);
    const { forwardMap, reverseMap } = getLatLngRegionMapping(collections);
    Object.entries(reverseMap).forEach(([region, coords]) => {
        coords.forEach(async (coord) => {
            const [lng, lat, ..._] = coord.split(",").map(Number);
            const resp = await accuWeatherService.getTodayForecast(lat, lng);

        });
    });
};

callback();

// every 12 AM
const job = new cron.CronJob('0 0-23 * * *', callback);

job.start();
