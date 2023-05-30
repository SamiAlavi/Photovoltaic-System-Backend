import admin, { firestore } from 'firebase-admin';
import { app } from './firebase';
import { WhereCondition } from './types';

const database = admin.firestore(app);

async function getDocuments(collectionName: string) {
    try {
        const collectionRef = database.collection(collectionName);
        const collectionSnapshot = await collectionRef.get();
        const documents = collectionSnapshot.docs.map(document => ({ id: document.id, ...document.data() }));
        console.log(documents)
        return documents;
    }
    catch (error) {
        console.error(`Error getting documents: ${error}`);
        throw error;
    }
}

async function getFilteredDocuments(collectionName: string, ...conditions: WhereCondition[]) {
    try {
        let collectionRef: firestore.Query = database.collection(collectionName);
        conditions.forEach(condition => {
            collectionRef = collectionRef.where(...condition);
        });
        const collectionSnapshot = await collectionRef.get();
        const filteredDocuments = collectionSnapshot.docs.map(document => ({ id: document.id, ...document.data() }));
        console.log(filteredDocuments)
        return filteredDocuments;
    }
    catch (error) {
        console.error(`Error getting filtered documents: ${error}`);
        throw error;
    }
}

export { getDocuments, getFilteredDocuments };
