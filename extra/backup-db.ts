import cloudFirestore from "../src/services/firebase/cloudFirestore";
import fileService from "../src/services/fileService";

async function getProjectsCollections() {
    try {
        const collections = await cloudFirestore.database.collection("projects").doc("projects").listCollections();
        const backupData = {};

        for (const collection of collections) {
            const collectionSnapshot = await collection.get();
            const documents = {};

            collectionSnapshot.forEach(doc => {
                documents[doc.id] = doc.data();
            });

            backupData[collection.id] = documents;
        }

        // Write backup data to a JSON file
        fileService.writeFileSync('backup1.json', JSON.stringify(backupData, null, 2));

        console.log('Backup created successfully!');
    } catch (error) {
        console.error('Error creating backup:', error);
    }

}

// Backup collections with document IDs
async function backupCollections() {
    try {
        const collections = await cloudFirestore.database.listCollections();
        const backupData = {};

        for (const collection of collections) {
            const collectionSnapshot = await collection.get();
            const documents = {};

            collectionSnapshot.forEach(doc => {
                documents[doc.id] = doc.data();
            });

            backupData[collection.id] = documents;
        }
        await getProjectsCollections();

        // Write backup data to a JSON file
        fileService.writeFileSync('backup.json', JSON.stringify(backupData, null, 2));

        console.log('Backup created successfully!');
    } catch (error) {
        console.error('Error creating backup:', error);
    }
}

// Invoke the backupCollections function
backupCollections();
