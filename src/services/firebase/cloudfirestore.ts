import admin from 'firebase-admin';
import { app } from './firebase';
import { CollectionReferenceOrQuery, CollectionReferenceDocumentData, QueryDocumentData, WhereCondition } from './types';

const database = admin.firestore(app);

async function getDocumentsWithCollection(collectionRef: CollectionReferenceOrQuery) {
    try {
        const collectionSnapshot = await collectionRef.get();
        const documents = collectionSnapshot.docs.map(document => ({ id: document.id, ...document.data() }));
        console.log(documents);
        return documents;
    }
    catch (error: any) {
        catchError(error, 'Error getting documents');
    }
}

async function getDocumentsWithName(collectionName: string) {
    const collectionRef = database.collection(collectionName);
    return await getDocumentsWithCollection(collectionRef);
}

async function getFilteredDocumentsWithName(collectionName: string, ...conditions: WhereCondition[]) {
    let collectionRef: QueryDocumentData = database.collection(collectionName);
    conditions.forEach(condition => {
        collectionRef = collectionRef.where(...condition);
    });
    return await getDocumentsWithCollection(collectionRef);
}

async function createDocumentWithCollection(collectionRef: CollectionReferenceDocumentData, data: {}) {
    try {
        const docRef = await collectionRef.add(data);
        console.log('Document created with ID:', docRef.id);
    }
    catch (error: any) {
        catchError(error, 'Error creating document');
    }
}

async function createDocumentWithName(collectionName: string, data: {}) {
    const collectionRef = database.collection(collectionName);
    await createDocumentWithCollection(collectionRef, data);
}

async function updateDocumentWithCollection(collectionRef: CollectionReferenceDocumentData, documentId: string, data: {}) {
    try {
        const docRef = collectionRef.doc(documentId);
        await docRef.update(data);
        console.log('Document updated successfully!');
    }
    catch (error: any) {
        catchError(error, 'Error updating document');
    }
}

async function updateDocumentWithName(collectionName: string, documentId: string, data: {}) {
    const collectionRef = database.collection(collectionName);
    await updateDocumentWithCollection(collectionRef, documentId, data);
}

async function deleteDocumentWithCollection(collectionRef: CollectionReferenceDocumentData, documentId: string) {
    try {
        const docRef = collectionRef.doc(documentId);
        await docRef.delete();
        console.log('Document updated successfully!');
    }
    catch (error: any) {
        catchError(error, 'Error deleting document');
    }
}

async function deleteDocumentWithName(collectionName: string, documentId: string) {
    const collectionRef = database.collection(collectionName);
    await deleteDocumentWithCollection(collectionRef, documentId);
}

function catchError(error: Error, message: string) {
    console.error(`${message}: ${error}`);
    throw error;
}

export {
    getDocumentsWithCollection,
    getDocumentsWithName,
    getFilteredDocumentsWithName,
    createDocumentWithCollection,
    createDocumentWithName,
    updateDocumentWithCollection,
    updateDocumentWithName,
    deleteDocumentWithCollection,
    deleteDocumentWithName,
};
