import cloudFirestore from "../src/services/firebase/cloudFirestore";
import fileService from "../src/services/fileService";
import projectService from "../src/services/projectService";

async function getProjectsCollectionsData() {
    return await projectService.getAllProjectsCollectionsData();
}

// Backup collections with document IDs
async function backupCollections() {
    try {
        const collections = await cloudFirestore.getRootCollectionsData();
        const projectsCollection = await getProjectsCollectionsData();
        const projectsCollectionIndex = collections.findIndex((collection) => collection.collectionId === 'projects');
        collections[projectsCollectionIndex].documents[0].collections = projectsCollection;

        // Write backup data to a JSON file
        fileService.writeFileSync('backup.json', JSON.stringify(collections, null, 4));

        console.log('Backup created successfully!');
    } catch (error) {
        console.error('Error creating backup:', error);
    }
}

// Invoke the backupCollections function
backupCollections();
