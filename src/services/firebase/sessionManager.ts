import cloudFirestoreService from './cloudFirestore';
import { CustomUserRecord } from '../../shared/interfaces';

class SessionManager {
    private sessionsCollection = cloudFirestoreService.database.collection("sessions");

    async setSession(user: CustomUserRecord): Promise<string> {
        const docId = await cloudFirestoreService.createDocument(this.sessionsCollection, user, user.uid);
        return docId;
    }

    async getSession(userUid: string) {
        const doc = await cloudFirestoreService.getDocument(this.sessionsCollection, userUid);
        return doc;
    }

    async deleteSession(userUid: string) {
        await cloudFirestoreService.deleteDocument(this.sessionsCollection, userUid);
    }
}

export default new SessionManager();
