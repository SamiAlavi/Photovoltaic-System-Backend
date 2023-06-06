import admin from 'firebase-admin';
import { firebaseAdminApp } from './firebase';
import { CollectionReferenceOrQuery, CollectionReferenceDocumentData, QueryDocumentData, WhereCondition, DocumentReference } from './types';

class CloudFirestore {
    database = admin.firestore(firebaseAdminApp);

    getDocument(collectionName: string, documentId: string): any;
    getDocument(collectionRef: CollectionReferenceDocumentData, documentId: string): any;

    async getDocument(collection: string | CollectionReferenceDocumentData, documentId: string) {
        try {
            const docRef = this.getCollection(collection).doc(documentId);
            const documentSnapshot = await docRef.get();

            if (documentSnapshot.exists) {
                const documentData = documentSnapshot.data();
                console.log('Document data:', documentData);
                return documentData;
            }
            else {
                const documentData = documentSnapshot.data();
                console.log('Document data:', documentData);
                return documentData;
            }
        }
        catch (error: any) {
            this.handleError(error, 'Error getting document');
        }
    }

    getDocuments(collectionName: string): any;
    getDocuments(collectionRef: CollectionReferenceOrQuery): any;
    getDocuments(collectionName: string, ...conditions: WhereCondition[]): any;
    getDocuments(collectionRef: CollectionReferenceOrQuery, ...conditions: WhereCondition[]): any;

    async getDocuments(collection: string | CollectionReferenceOrQuery, ...conditions: WhereCondition[]) {
        try {
            let collectionRef = this.getCollection(collection);
            if (conditions.length) {
                conditions.forEach(condition => {
                    collectionRef = collectionRef.where(...condition);
                });
            }
            const collectionSnapshot = await collectionRef.get();
            const documents = collectionSnapshot.docs.map(document => ({ id: document.id, ...document.data() }));
            console.log(documents);
            return documents;
        }
        catch (error: any) {
            this.handleError(error, 'Error getting documents');
        }
    }

    createDocument(collectionName: string, data: {}, documentId?: string): any;
    createDocument(collectionRef: CollectionReferenceDocumentData, data: {}, documentId?: string): any;

    async createDocument(collection: string | CollectionReferenceDocumentData, data: {}, documentId?: string) {
        try {
            let docRef: DocumentReference;
            const collectionRef = this.getCollection(collection);
            if (documentId) {
                docRef = collectionRef.doc(documentId);
                await docRef.set(data);
            }
            else {
                docRef = await collectionRef.add(data);
            }
            console.log('Document created with ID:', docRef.id);
            return docRef.id;
        }
        catch (error: any) {
            this.handleError(error, 'Error creating document');
        }
    }

    updateDocument(collectionName: string, data: {}, documentId: string): any;
    updateDocument(collectionName: CollectionReferenceDocumentData, data: {}, documentId: string): any;

    async updateDocument(collection: string | CollectionReferenceDocumentData, data: {}, documentId: string) {
        try {
            const collectionRef = this.getCollection(collection);
            const docRef = collectionRef.doc(documentId);
            await docRef.update(data);
            console.log('Document updated successfully!');
        }
        catch (error: any) {
            this.handleError(error, 'Error updating document');
        }
    }

    deleteDocument(collectionName: string, documentId: string): any;
    deleteDocument(collectionName: CollectionReferenceDocumentData, documentId: string): any;

    async deleteDocument(collection: string | CollectionReferenceDocumentData, documentId: string) {
        try {
            const collectionRef = this.getCollection(collection);
            const docRef = collectionRef.doc(documentId);
            await docRef.delete();
            console.log('Document deleted successfully!');
        }
        catch (error: any) {
            this.handleError(error, 'Error deleting document');
        }
    }

    private getCollection(collection: string | CollectionReferenceDocumentData): CollectionReferenceDocumentData;
    private getCollection(collection: string | CollectionReferenceOrQuery): CollectionReferenceOrQuery;

    private getCollection(collection: string | CollectionReferenceDocumentData) {
        return typeof (collection) === "string" ? this.database.collection(collection) : collection;
    }

    private handleError(error: Error, message: string) {
        console.error(`${message}: ${error}`);
        throw error;
    }
}

export default new CloudFirestore();
