import cron from 'cron';
import { IProductDetail, IProjectCollection } from './shared/interfaces';
import weatherService from './services/weather/weather';
import reportService from './services/reportService';
import firebaseAuth from './services/firebase/firebaseAuth';
import emailService from './services/emailService';
import fileService from './services/fileService';
import projectService from './services/projectService';

const getMappings = (collections: IProjectCollection[]) => {
    if (!collections) {
        return;
    }
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const millisecondsPer30Days = millisecondsPerDay * 30; // Number of milliseconds in 30 days


    const days30Completed: { [key: string]: IProductDetail[]; } = {};
    const forwardMap: { [key: string]: string; } = {};
    const reverseMap: { [key: string]: string[]; } = {};

    collections.forEach((collection) => {
        const userId = collection.collectionId;
        const projects = collection.documents;
        projects.forEach((project) => {
            const products = project.products;
            products.forEach((product) => {
                const { lng, lat, region, timestamp, isActive } = product;
                if (!isActive) {
                    return;
                }
                const key = `${lng},${lat}`;
                const value = region || key;
                const timeDifference = Math.abs(Date.now() - timestamp);
                if (timeDifference >= millisecondsPer30Days) {
                    const key = `${userId}~${project.id}`;
                    try {
                        days30Completed[key].push(product);
                    }
                    catch {
                        days30Completed[key] = [product];
                    }
                    return;
                }
                forwardMap[key] = value;
                try {
                    reverseMap[value].push(key);
                }
                catch (error) {
                    reverseMap[value] = [key];
                }
            });
        });
    });
    return { days30Completed, forwardMap, reverseMap };
};

const on30daysPassed = async (userUid: string, projectId: string, timePassedProducts: IProductDetail[]) => {
    // generate report
    const filePaths = [];
    for (const timePassedProduct of timePassedProducts) {
        const { lng, lat, region } = timePassedProduct;
        await weatherService.addLast30DaysDataInRegion(region, lng, lat);
        const filePath = await reportService.generateReportCSV(timePassedProduct);
        filePaths.push(filePath);
    }
    // mail to user
    await sendEmailToUser(userUid, filePaths, timePassedProducts);
    fileService.deleteFilesSync(filePaths);

    // set products, project to readonly
    for (const timePassedProduct of timePassedProducts) {
        const project = await projectService.getProject(userUid, projectId);
        const dbProducts = project.products;
        const dbProduct = dbProducts.find((prod) => prod.id === timePassedProduct.id);
        if (dbProduct) {
            const reportJson = await reportService.generateReportJSON(dbProduct);
            dbProduct.isActive = false;
            dbProduct.report = reportJson;
            const isProjectActive = dbProducts.some((prod) => prod.isActive);
            project.isActive = isProjectActive;
            await projectService.updateProject(userUid, project);
        }
    };


};

const sendEmailToUser = async (userUid: string, filePaths: string[], products: IProductDetail[]) => {
    const userEmail = await firebaseAuth.getUserEmailFromId(userUid);
    await emailService.sendEmail(userEmail, filePaths, products);
};

const on30DaysCompleted = (days30Completed: { [key: string]: IProductDetail[]; }) => {
    for (const [key, products] of Object.entries(days30Completed)) {
        {
            setTimeout(() => {
                const [userUid, projectId] = key.split('~', 2);
                on30daysPassed(userUid, projectId, products);
            });
        }
    }
};

const callback = async () => {
    try {
        console.log(`Cron Job ran at ${new Date()}`);

        const collections = await projectService.getAllUsersCollections();
        const { days30Completed, forwardMap, reverseMap } = getMappings(collections);
        on30DaysCompleted(days30Completed);
        for (let region in reverseMap) {
            let coords = reverseMap[region];
            for (let i = 0; i < coords.length; i++) {
                const [lng, lat, ..._] = coords[i].split(",").map(Number);
                weatherService.addTodayWeatherDataInRegion(region, lng, lat);
            }
        }
    }
    catch (error: any) {
        console.log(error);
    }
};

callback();

// every 12.05 AM
const job = new cron.CronJob('5 0 * * *', callback);

job.start();
