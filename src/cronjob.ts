import cron from 'cron';
import { cloudFirestoreService } from './services/services';
import { IProductDetail, IProjectCollection, IWeatherData } from './shared/interfaces';
import weather from './services/weather/weather';
import reportService from './services/reportService';
import firebaseAuth from './services/firebase/firebaseAuth';
import emailService from './services/emailService';
import fileService from './services/fileService';

const getLatLngRegionMapping = (collections: IProjectCollection[]) => {
    if (!collections) {
        return;
    }
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const millisecondsPer30Days = millisecondsPerDay * 30; // Number of milliseconds in 30 days


    const days30Completed: { [key: string]: IProductDetail[]; } = {};
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
                    try {
                        days30Completed[userId].push(product);
                    }
                    catch {
                        days30Completed[userId] = [product];
                    }
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
    return { days30Completed, forwardMap, reverseMap };
};

const on30daysPassed = async (userUid: string, products: IProductDetail[]) => {
    // generate report
    const filePaths = [];
    for (const product of products) {
        const { lng, lat, region } = product;
        await weather.addLast30DaysDataInRegion(region, lng, lat);
        const filePath = await reportService.generateReport(product);
        filePaths.push(filePath);
    }
    // mail to user
    await sendEmailToUser(userUid, filePaths, products);
    fileService.deleteFilesSync(filePaths);


    // set project to readonly?
};

const sendEmailToUser = async (userUid: string, filePaths: string[], products: IProductDetail[]) => {
    const userEmail = await firebaseAuth.getUserEmailFromId(userUid);
    await emailService.sendEmail(userEmail, filePaths, products);
};

const on30DaysCompleted = (days30Completed: { [key: string]: IProductDetail[]; }) => {
    for (const [userUid, products] of Object.entries(days30Completed)) {
        {
            setTimeout(() => {
                on30daysPassed(userUid, products);
            });
        }
    }
};

const callback = async () => {
    console.log(new Date());

    const projectsKey = "projects";
    const projectsDocument = cloudFirestoreService.database.collection(projectsKey).doc(projectsKey);

    const collections: IProjectCollection[] = await cloudFirestoreService.getAllCollectionsDataInDocument(projectsDocument);
    const { days30Completed, forwardMap, reverseMap } = getLatLngRegionMapping(collections);
    on30DaysCompleted(days30Completed);
    for (let region in reverseMap) {
        let coords = reverseMap[region];
        for (let i = 0; i < coords.length; i++) {
            const [lng, lat, ..._] = coords[i].split(",").map(Number);
            weather.addTodayWeatherDataInRegion(region, lng, lat);
        }
    }
};

callback();

// every 12 AM
const job = new cron.CronJob('0 0-23 * * *', callback);

job.start();
