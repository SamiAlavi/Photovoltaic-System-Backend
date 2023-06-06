import { Project } from '../shared/interfaces';
import cloudFirestoreService from './firebase/cloudFirestore';
import { CollectionReferenceDocumentData } from './firebase/types';

class ProjectService {
    private projectsKey = "projects";
    private projectsDocument = cloudFirestoreService.database.collection(this.projectsKey).doc(this.projectsKey);

    private getUserProjectsCollection(userUid: string): CollectionReferenceDocumentData {
        return this.projectsDocument.collection(userUid);
    }

    async getProjects(userUid: string): Promise<Project[]> {
        return await cloudFirestoreService.getDocuments(this.getUserProjectsCollection(userUid));
    }

    async getProject(userUid: string, projectId: string) {
        return await cloudFirestoreService.getDocument(this.getUserProjectsCollection(userUid), projectId);
    }

    async initProject(userUid: string) {
        const tempProject: Project = { id: "_temp" };
        return await this.saveProject(userUid, tempProject);
    }

    async saveProject(userUid: string, project: Project): Promise<string> {
        const docId = await cloudFirestoreService.createDocument(this.getUserProjectsCollection(userUid), project, project.id);
        return docId;
    }

    async deleteProject(userUid: string, projectId: string) {
        await cloudFirestoreService.deleteDocument(this.getUserProjectsCollection(userUid), projectId);
    }
}

export default new ProjectService();
