import { firestore } from "firebase-admin";

type WhereCondition = [string, firestore.WhereFilterOp, any];

export { WhereCondition };
