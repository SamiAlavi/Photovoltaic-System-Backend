import productTypes from "../init/productsTypes";
import cloudFirestore from "../src/services/firebase/cloudFirestore";
import { ICustomUserRecord, IProductDetail, IWeatherData } from "../src/shared/interfaces";

const tempDocumentId = "_temp";

function initProductTypesCollection() {
    const productTypeCollectionPath = "/product_types/";
    productTypes.forEach((productType) => {
        cloudFirestore.createDocument(productTypeCollectionPath, productType);
    });
}

function initProjectsCollection() {
    const projectsCollectionPath = `/projects/projects/${tempDocumentId}/`;
    const tempProduct: Partial<IProductDetail> = { id: tempDocumentId, isActive: false };
    cloudFirestore.createDocument(projectsCollectionPath, tempProduct, tempDocumentId);
}

function initSessionsCollection() {
    const sessionsCollectionPath = `/sessions/`;
    const tempProduct: Partial<ICustomUserRecord> = { uid: tempDocumentId };
    cloudFirestore.createDocument(sessionsCollectionPath, tempProduct, tempDocumentId);
}

function initWeatherCollection() {
    const sessionsCollectionPath = `/weather/`;
    const tempProduct: Partial<IWeatherData> = { [tempDocumentId]: [] };
    cloudFirestore.createDocument(sessionsCollectionPath, tempProduct, tempDocumentId);
}


async function init() {
    initProductTypesCollection();
    initProjectsCollection();
    initSessionsCollection();
    initWeatherCollection();
}

init();
