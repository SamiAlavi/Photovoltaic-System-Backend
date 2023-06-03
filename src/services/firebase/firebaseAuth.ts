import { FirebaseError } from 'firebase-admin';
import { firebaseApp } from './firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from "firebase/auth";

class FirebaseAuth {
    private auth = getAuth(firebaseApp);

    async createEmailPasswordBasedAccount(email: string, password: string): Promise<User> {
        const userRecord = (await createUserWithEmailAndPassword(this.auth, email, password)).user;
        console.log('Successfully created new user:', userRecord.uid);
        return userRecord;
    }

    async loginEmailPasswordBasedAccount(email: string, password: string): Promise<User> {
        const userRecord = (await signInWithEmailAndPassword(this.auth, email, password)).user;
        console.log('Successfully logged in:', userRecord);
        return userRecord;
    }
}

export default new FirebaseAuth();

