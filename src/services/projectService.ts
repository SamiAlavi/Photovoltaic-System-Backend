import { IProductDetail, IProject, IProjectCollection } from '../shared/interfaces';
import cloudFirestoreService from './firebase/cloudFirestore';
import { CollectionReferenceDocumentData } from './firebase/types';

class ProjectService {
    private projectsKey = "projects";
    private projectsDocument = cloudFirestoreService.database.collection(this.projectsKey).doc(this.projectsKey);

    private getUserProjectsCollection(userUid: string): CollectionReferenceDocumentData {
        return this.projectsDocument.collection(userUid);
    }

    async getProjectsIds(userUid: string): Promise<string[]> {
        return await cloudFirestoreService.getDocumentsIds(this.getUserProjectsCollection(userUid));
    }

    async getProjects(userUid: string): Promise<IProject[]> {
        return await cloudFirestoreService.getDocuments(this.getUserProjectsCollection(userUid));
    }

    async getProject(userUid: string, projectId: string): Promise<IProject> {
        return await cloudFirestoreService.getDocument(this.getUserProjectsCollection(userUid), projectId);
    }

    async initProject(userUid: string) {
        const tempProject: IProject = { id: "_temp", products: [], timeCreated: Date.now(), isActive: false };
        return await this.saveProject(userUid, tempProject);
    }

    async saveProject(userUid: string, project: IProject): Promise<string> {
        const docId = await cloudFirestoreService.createDocument(this.getUserProjectsCollection(userUid), project, project.id);
        return docId;
    }

    createProject(userUid: string, projectId: string): IProject {
        const project: IProject = { id: projectId, products: [], timeCreated: Date.now(), isActive: true };
        this.saveProject(userUid, project);
        return project;
    }


    async deleteProject(userUid: string, projectId: string) {
        await cloudFirestoreService.deleteDocument(this.getUserProjectsCollection(userUid), projectId);
    }

    async deleteAllProjects(userUid: string) {
        await cloudFirestoreService.deleteCollection(this.getUserProjectsCollection(userUid));
    }

    async addProductInProject(userUid: string, projectId: string, product: IProductDetail) {
        const project = await this.getProject(userUid, projectId);
        project.products.push(product);
        this.updateProject(userUid, project);
    }

    async editProductInProject(userUid: string, projectId: string, product: IProductDetail) {
        const project = await this.getProject(userUid, projectId);
        const prodIndex = project.products.findIndex((prod) => prod.id === product.id);
        if (prodIndex > -1) {
            project.products[prodIndex] = product;
        }
        this.updateProject(userUid, project);
    }

    async deleteProductInProject(userUid: string, projectId: string, product: IProductDetail) {
        const project = await this.getProject(userUid, projectId);
        project.products = project.products.filter((prod) => prod.id !== product.id);
        this.updateProject(userUid, project);
    }


    updateProject(userUid: string, project: IProject) {
        cloudFirestoreService.updateDocument(this.getUserProjectsCollection(userUid), project.id, project);
    }

    async getAllUsersCollections(): Promise<IProjectCollection[]> {
        return await cloudFirestoreService.getAllCollectionsDataInDocument(this.projectsDocument);
    }
}

export default new ProjectService();
