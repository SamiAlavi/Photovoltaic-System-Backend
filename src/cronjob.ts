import cron from 'cron';
import { cloudFirestoreService } from './services/services';
import { IProjectCollection } from './shared/interfaces';

function getLatLngRegionMapping(collections: IProjectCollection[]) {
  if (!collections) {
    return;
  }
  const mapping = {};

  for (let i = 0; i < collections.length; i++) {
    const documents = collections[i].documents;
    for (let j = 0; j < documents.length; j++) {
      const products = documents[j].products;
      for (let k = 0; k < products.length; k++) {
        const { lng, lat, region } = products[k];
        const key = `${lng},${lat}`;
        mapping[key] = region || key;
        console.log(key, mapping[key]);
      }
    }
  }
}

const callback = async () => {
  const projectsKey = "projects";
  const projectsDocument = cloudFirestoreService.database.collection(projectsKey).doc(projectsKey);
  const collections: IProjectCollection[] = await cloudFirestoreService.getAllCollectionsDataInDocument(projectsDocument);
  getLatLngRegionMapping(collections);
};

callback();

// every 12 AM
const job = new cron.CronJob('0 0 * * *', callback);

job.start();
