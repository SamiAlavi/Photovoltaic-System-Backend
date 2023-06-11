import { firestore } from "firebase-admin";

type WhereCondition = [string, firestore.WhereFilterOp, any];
type DocumentData = firestore.DocumentData;
type CollectionReference<T> = firestore.CollectionReference<T>;
type Query<T> = firestore.Query<T>;
type CollectionReferenceDocumentData = CollectionReference<DocumentData>;
type QueryDocumentData = Query<DocumentData>;
type CollectionReferenceOrQuery = CollectionReferenceDocumentData | QueryDocumentData;
type DocumentReference = firestore.DocumentReference<DocumentData>;

export {
    WhereCondition,
    CollectionReferenceOrQuery,
    CollectionReferenceDocumentData,
    QueryDocumentData,
    DocumentReference,
    DocumentData,
};
