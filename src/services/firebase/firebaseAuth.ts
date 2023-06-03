import { firebaseApp } from './firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from "firebase/auth";

class FirebaseAuth {
    private auth = getAuth(firebaseApp);

    async createEmailPasswordBasedAccount(email: string, password: string): Promise<User> {
        try {
            const userRecord = (await createUserWithEmailAndPassword(this.auth, email, password)).user;
            console.log('Successfully created new user:', userRecord.uid);
            return userRecord;
        }
        catch (error) {
            console.error('Error creating new user:', error);
            throw error;
        }
    }

    async loginEmailPasswordBasedAccount(email: string, password: string): Promise<User> {
        try {
            const userRecord = (await signInWithEmailAndPassword(this.auth, email, password)).user;
            console.log('Successfully logged in:', userRecord);
            return userRecord;
        }
        catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }
}

export default new FirebaseAuth();
