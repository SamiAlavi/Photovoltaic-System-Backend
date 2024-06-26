import admin from 'firebase-admin';
import { firebaseAdminApp } from './firebase';
import { CollectionReferenceOrQuery, CollectionReferenceDocumentData, DocumentData, WhereCondition, DocumentReference, CollectionsList } from './types';

class CloudFirestore {
    private readonly TEMP_FILE_PREFIX = "_";
    database = admin.firestore(firebaseAdminApp);

    async getRootCollectionsData(): Promise<any> {
        return this.getAllCollectionsDataInDocument(this.database);
    }

    async getAllCollectionsInDocument(documentRef: DocumentData): Promise<CollectionsList> {
        const collections = await documentRef.listCollections();
        return collections.filter((collection) => !collection.id.startsWith(this.TEMP_FILE_PREFIX));
    }

    async getAllCollectionsDataInDocument(documentRef: DocumentData): Promise<any> {
        const collections = await this.getAllCollectionsInDocument(documentRef);
        const collectionData = [];

        for (const collection of collections) {
            const collectionDocuments = await this.getDocuments(collection);
            collectionData.push({
                collectionId: collection.id,
                documents: collectionDocuments
            });
        }

        return collectionData;
    };

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
            this.handleError(error, `Error getting document (${documentId})`);
        }
    }

    getDocumentsIds(collectionName: string): Promise<string[]>;
    getDocumentsIds(collectionRef: CollectionReferenceDocumentData): Promise<string[]>;

    async getDocumentsIds(collection: string | CollectionReferenceDocumentData): Promise<string[]> {
        try {
            const collectionRef = this.getCollection(collection);
            const documentReferences = await collectionRef.listDocuments();
            const documentIds = documentReferences.map(doc => doc.id).filter(id => !id.startsWith(this.TEMP_FILE_PREFIX));
            return documentIds;
        }
        catch (error: any) {
            this.handleError(error, 'Error getting documents ids');
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
                if (!document.id.startsWith(this.TEMP_FILE_PREFIX)) {
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
            console.log(`Document created with ID (${docRef.id})`);
            return docRef.id;
        }
        catch (error: any) {
            this.handleError(error, 'Error creating document');
        }
    }

    updateDocument(collectionName: string, documentId: string, data: {}): Promise<any>;
    updateDocument(collectionName: CollectionReferenceDocumentData, documentId: string, data: {}): Promise<any>;

    async updateDocument(collection: string | CollectionReferenceDocumentData, documentId: string, data: {}): Promise<any> {
        try {
            const collectionRef = this.getCollection(collection);
            const docRef = collectionRef.doc(documentId);
            try {
                await docRef.update(data);
                console.log(`Document updated successfully! (${documentId})`);
            }
            catch {
                await this.setDocument(collectionRef, documentId, data);
            }
        }
        catch (error: any) {
            this.handleError(error, `Error updating document (${documentId})`);
        }
    }

    setDocument(collectionName: string, documentId: string, data: {}): Promise<any>;
    setDocument(collectionName: CollectionReferenceDocumentData, documentId: string, data: {}): Promise<any>;

    async setDocument(collection: string | CollectionReferenceDocumentData, documentId: string, data: {}): Promise<any> {
        try {
            const collectionRef = this.getCollection(collection);
            const docRef = collectionRef.doc(documentId);
            await docRef.set(data);
            console.log(`Document set successfully! (${documentId})`);
        }
        catch (error: any) {
            this.handleError(error, `Error setting document (${documentId})`);
        }
    }

    deleteDocument(collectionName: string, documentId: string): Promise<void>;
    deleteDocument(collectionName: CollectionReferenceDocumentData, documentId: string): Promise<void>;

    async deleteDocument(collection: string | CollectionReferenceDocumentData, documentId: string): Promise<void> {
        try {
            const collectionRef = this.getCollection(collection);
            const docRef = collectionRef.doc(documentId);
            await docRef.delete();
            console.log(`Document deleted successfully! (${documentId})`);
        }
        catch (error: any) {
            this.handleError(error, `Error deleting document (${documentId})`);
        }
    }

    deleteCollection(collectionName: string): Promise<void>;
    deleteCollection(collectionName: CollectionReferenceDocumentData): Promise<void>;

    async deleteCollection(collection: string | CollectionReferenceDocumentData) {
        try {
            const collectionRef = this.getCollection(collection);

            const batch = this.database.batch();
            const querySnapshot = await collectionRef.get();

            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();

            console.log(`Collection deleted successfully. (${collectionRef.id})`);

        }
        catch (error: any) {
            this.handleError(error, `Error deleting collection`);
        }
    }

    private getCollection(collection: string | CollectionReferenceDocumentData): CollectionReferenceDocumentData;
    private getCollection(collection: string | CollectionReferenceOrQuery): CollectionReferenceOrQuery;

    private getCollection(collection: string | CollectionReferenceDocumentData) {
        return typeof (collection) === "string" ? this.database.collection(collection) : collection;
    }

    private handleError(error: Error, message: string) {
        console.error(`${message}: ${error}`);
    }
}

export default new CloudFirestore();
