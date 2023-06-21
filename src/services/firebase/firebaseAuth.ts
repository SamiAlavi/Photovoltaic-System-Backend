import { firebaseAdminApp, firebaseApp } from './firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from "firebase/auth";
import { UpdateRequest } from 'firebase-admin/lib/auth/auth-config';

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

    async verifyUserEmail(userUid: string, email: string) {
        const userEmail = await this.getUserEmailFromId(userUid);
        if (userEmail !== email) {
            throw Error("Email is not correct");
        }
    }

    async updateUserPassword(userUid: string, email: string, currentPassword: string, newPassword: string) {
        await this.verifyUserEmail(userUid, email);
        await this.loginEmailPasswordBasedAccount(email, currentPassword);
        const properties: UpdateRequest = {
            password: newPassword,
        };
        await this.adminAuth.updateUser(userUid, properties);

        console.log('Password updated successfully.');
    }

    async deleteUser(userUid: string, email: string) {
        await this.verifyUserEmail(userUid, email);
        //await this.loginEmailPasswordBasedAccount(email, currentPassword);
        await this.adminAuth.deleteUser(userUid);
        console.log('User deleted successfully.');
    }

}

export default new FirebaseAuth();

