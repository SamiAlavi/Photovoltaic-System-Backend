import cron from 'cron';
import { cloudFirestoreService } from './services/services';
import { IProductDetail, IProjectCollection, IWeatherData } from './shared/interfaces';
import accuWeatherService from './services/weather/accuWeather';
import Helpers from './shared/helpers';
import visualCrossingService from './services/weather/visualCrossing';
import weather from './services/weather/weather';

const getLatLngRegionMapping = (collections: IProjectCollection[]) => {
    if (!collections) {
        return;
    }
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const millisecondsPer30Days = millisecondsPerDay * 30; // Number of milliseconds in 30 days


    const days30Completed: string[] = [];
    const forwardMap: { [key: string]: string; } = {};
    const reverseMap: { [key: string]: string[]; } = {};

    for (let i = 0; i < collections.length; i++) {
        const userId = collections[i].collectionId;
        const userProjects = collections[i].documents;
        for (let j = 0; j < userProjects.length; j++) {
            const userProducts = userProjects[j].products;
            for (let k = 0; k < userProducts.length; k++) {
                const product = userProducts[k];
                const { lng, lat, region, timestamp } = product;
                const key = `${lng},${lat}`;
                const value = region || key;
                const timeDifference = Math.abs(Date.now() - timestamp);
                if (timeDifference >= millisecondsPer30Days) {
                    on30daysPassed(userId, product);
                    continue;
                }
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
};

const on30daysPassed = (userId: string, product: IProductDetail) => {
    // generate report
    // mail to user
    // set project to readonly?
};

const callback = async () => {
    console.log(new Date());

    const projectsKey = "projects";
    const projectsDocument = cloudFirestoreService.database.collection(projectsKey).doc(projectsKey);

    const collections: IProjectCollection[] = await cloudFirestoreService.getAllCollectionsDataInDocument(projectsDocument);
    const { forwardMap, reverseMap } = getLatLngRegionMapping(collections);
    for (let region in reverseMap) {
        let coords = reverseMap[region];
        for (let i = 0; i < coords.length; i++) {
            const [lng, lat, ..._] = coords[i].split(",").map(Number);
            weather.addWeatherDataInRegion(region, new Date(), lng, lat);
        }
    }
};

callback();

// every 12 AM
const job = new cron.CronJob('0 0-23 * * *', callback);

//job.start();
