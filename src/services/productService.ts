import { IProduct } from '../shared/interfaces';
import cloudFirestoreService from './firebase/cloudFirestore';

class ProjectService {
    private productTypesKey = "product_types";
    private productsCollection = cloudFirestoreService.database.collection(this.productTypesKey);


    async getProducts(): Promise<IProduct[]> {
        return await cloudFirestoreService.getDocuments(this.productsCollection);
    }
}

export default new ProjectService();
