import { firebaseAdminApp, firebaseApp } from './firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from "firebase/auth";

class FirebaseAuth {
    private auth = getAuth(firebaseApp);
    private adminAuth = firebaseAdminApp.auth();

    async createEmailPasswordBasedAccount(email: string, password: string): Promise<User> {
        const userRecord = (await createUserWithEmailAndPassword(this.auth, email, password)).user;
        console.log('Successfully created new user:', userRecord.uid);
        return userRecord;
    }

    async loginEmailPasswordBasedAccount(email: string, password: string): Promise<User> {
        const userRecord = (await signInWithEmailAndPassword(this.auth, email, password)).user;
        console.log('Successfully logged in:', userRecord.uid);
        return userRecord;
    }

    async getUserEmailFromId(userUid: string): Promise<string> {
        try {
            const userRecord = await this.adminAuth.getUser(userUid);
            return userRecord.email || "";
        }
        catch (error) {
            console.error('Error fetching user:', error);
            return "";
        }
    }

    async updateUserPassword(userUid: string, email: string, currentPassword: string, newPassword: string) {
        await this.loginEmailPasswordBasedAccount(email, currentPassword);
        await this.adminAuth.updateUser(userUid, {
            password: newPassword,
        });

        console.log('Password updated successfully.');
    }

}

export default new FirebaseAuth();

