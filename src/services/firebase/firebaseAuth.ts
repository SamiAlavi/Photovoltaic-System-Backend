import admin from "firebase-admin";
import { app } from './firebase';
import { UserRecord } from "firebase-admin/lib/auth/user-record";

class FirebaseAuth {
    private auth = admin.auth(app);

    async createEmailPasswordBasedAccount(email: string, password: string): Promise<UserRecord> {
        try {
            const userRecord = await this.auth.createUser({
                email: email,
                password: password
            });
            console.log('Successfully created new user:', userRecord.uid);
            return userRecord;
        }
        catch (error) {
            console.error('Error creating new user:', error);
            throw error;
        }
    }

    async loginEmailPasswordBasedAccount(email: string, password: string): Promise<UserRecord> {
        try {
            const userRecord = await this.auth.getUserByEmail(email);
            const user = {
                uid: userRecord.uid,
                email: userRecord.email
            };
            console.log('Successfully logged in:', user);
            return userRecord;
        }
        catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }
}

export default new FirebaseAuth();
