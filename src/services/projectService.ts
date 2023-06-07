import { IProject } from '../shared/interfaces';
import cloudFirestoreService from './firebase/cloudFirestore';
import { CollectionReferenceDocumentData } from './firebase/types';

class ProjectService {
    private projectsKey = "projects";
    private projectsDocument = cloudFirestoreService.database.collection(this.projectsKey).doc(this.projectsKey);

    private getUserProjectsCollection(userUid: string): CollectionReferenceDocumentData {
        return this.projectsDocument.collection(userUid);
    }

    async getProjects(userUid: string): Promise<string[]> {
        return await cloudFirestoreService.getDocumentsIds(this.getUserProjectsCollection(userUid));
    }

    async getProject(userUid: string, projectId: string): Promise<IProject> {
        return await cloudFirestoreService.getDocument(this.getUserProjectsCollection(userUid), projectId);
    }

    async initProject(userUid: string) {
        const tempProject: IProject = { id: "_temp", name: "_temp", products: [] };
        return await this.saveProject(userUid, tempProject);
    }

    async saveProject(userUid: string, project: IProject): Promise<string> {
        const docId = await cloudFirestoreService.createDocument(this.getUserProjectsCollection(userUid), project, project.id);
        return docId;
    }

    async deleteProject(userUid: string, projectId: string) {
        await cloudFirestoreService.deleteDocument(this.getUserProjectsCollection(userUid), projectId);
    }
}

export default new ProjectService();
