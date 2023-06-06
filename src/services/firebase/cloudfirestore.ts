import admin from 'firebase-admin';
import { firebaseAdminApp } from './firebase';
import { CollectionReferenceOrQuery, CollectionReferenceDocumentData, QueryDocumentData, WhereCondition, DocumentReference } from './types';

class CloudFirestore {
    database = admin.firestore(firebaseAdminApp);

    getDocument(collectionName: string, documentId: string): Promise<any>;
    getDocument(collectionRef: CollectionReferenceDocumentData, documentId: string): Promise<any>;

    async getDocument(collection: string | CollectionReferenceDocumentData, documentId: string): Promise<any> {
        try {
            const docRef = this.getCollection(collection).doc(documentId);
            const documentSnapshot = await docRef.get();

            if (documentSnapshot.exists) {
                const documentData = documentSnapshot.data();
                return documentData;
            }
            else {
                throw Error();
            }
        }
        catch (error: any) {
            this.handleError(error, 'Error getting document');
        }
    }

    getDocuments(collectionName: string): Promise<any[]>;
    getDocuments(collectionRef: CollectionReferenceOrQuery): Promise<any[]>;
    getDocuments(collectionName: string, ...conditions: WhereCondition[]): Promise<any[]>;
    getDocuments(collectionRef: CollectionReferenceOrQuery, ...conditions: WhereCondition[]): Promise<any[]>;

    async getDocuments(collection: string | CollectionReferenceOrQuery, ...conditions: WhereCondition[]): Promise<any[]> {
        try {
            let collectionRef = this.getCollection(collection);
            if (conditions.length) {
                conditions.forEach(condition => {
                    collectionRef = collectionRef.where(...condition);
                });
            }
            const collectionSnapshot = await collectionRef.get();
            const documents = [];
            collectionSnapshot.docs.forEach(document => {
                if (!document.id.startsWith("_")) {
                    documents.push({ id: document.id, ...document.data() });
                }
            });
            return documents;
        }
        catch (error: any) {
            this.handleError(error, 'Error getting documents');
        }
    }

    createDocument(collectionName: string, data: {}, documentId?: string): Promise<any>;
    createDocument(collectionRef: CollectionReferenceDocumentData, data: {}, documentId?: string): Promise<any>;

    async createDocument(collection: string | CollectionReferenceDocumentData, data: {}, documentId?: string): Promise<any> {
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

    updateDocument(collectionName: string, data: {}, documentId: string): Promise<any>;
    updateDocument(collectionName: CollectionReferenceDocumentData, data: {}, documentId: string): Promise<any>;

    async updateDocument(collection: string | CollectionReferenceDocumentData, data: {}, documentId: string): Promise<any> {
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

    deleteDocument(collectionName: string, documentId: string): Promise<void>;
    deleteDocument(collectionName: CollectionReferenceDocumentData, documentId: string): Promise<void>;

    async deleteDocument(collection: string | CollectionReferenceDocumentData, documentId: string): Promise<void> {
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
