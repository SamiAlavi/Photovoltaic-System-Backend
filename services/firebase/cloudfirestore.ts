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
    catch (error: any) {
        catchError(error, 'Error getting documents');
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
    catch (error: any) {
        catchError(error, 'Error getting filtered documents');
    }
}

async function createDocument(collectionName: string, data: {}) {
    try {
        const collectionRef = database.collection(collectionName);
        const docRef = await collectionRef.add(data);
        console.log('Document created with ID:', docRef.id);
    }
    catch (error: any) {
        catchError(error, 'Error creating document');
    }
}

async function updateDocument(collectionName: string, documentId: string, data: {}) {
    try {
        const collectionRef = database.collection(collectionName);
        const docRef = collectionRef.doc(documentId);
        await docRef.update(data);
        console.log('Document updated successfully!');
    }
    catch (error: any) {
        catchError(error, 'Error updating document');
    }
}

async function deleteDocument(collectionName: string, documentId: string) {
    try {
        const collectionRef = database.collection(collectionName);
        const docRef = collectionRef.doc(documentId);
        await docRef.delete();
        console.log('Document updated successfully!');
    }
    catch (error: any) {
        catchError(error, 'Error deleting document');
    }
}

function catchError(error: Error, message: string) {
    console.error(`${message}: ${error}`);
    throw error;
}



export { getDocuments, getFilteredDocuments, createDocument, updateDocument, deleteDocument };
