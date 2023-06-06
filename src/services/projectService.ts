import cloudFirestoreService from './firebase/cloudFirestore';
import { CollectionReferenceDocumentData } from './firebase/types';

class SessionManager {
    private projectsKey = "projects";
    private projectsDocument = cloudFirestoreService.database.collection(this.projectsKey).doc(this.projectsKey);

    private getUserProjectsCollection(userUid: string): CollectionReferenceDocumentData {
        return this.projectsDocument.collection(userUid);
    }

    async getProjects(userUid: string): Promise<any> {
        return await cloudFirestoreService.getDocuments(this.getUserProjectsCollection(userUid));
    }

    async getProject(userUid: string, projectId: string) {
        return await cloudFirestoreService.getDocument(this.getUserProjectsCollection(userUid), projectId);
    }

    async saveProject(userUid: string, project: any): Promise<string> {
        const docId = await cloudFirestoreService.createDocument(this.getUserProjectsCollection(userUid), project, project.id);
        return docId;
    }

    async deleteProject(userUid: string, projectId: string) {
        await cloudFirestoreService.deleteDocument(this.getUserProjectsCollection(userUid), projectId);
    }
}

export default new SessionManager();
