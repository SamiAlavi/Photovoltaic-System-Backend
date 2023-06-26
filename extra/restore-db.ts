import cloudFirestore from "../src/services/firebase/cloudFirestore";
import fileService from "../src/services/fileService";

// Restore collections from backup
async function restoreCollections() {
    try {
        // Read the backup data from JSON file
        const backupData = JSON.parse(fileService.readFileSync('backup.json', 'utf8'));

        // Iterate through each collection in backup data
        for (const collectionName in backupData) {
            if (backupData.hasOwnProperty(collectionName)) {
                const documents = backupData[collectionName];

                // Get or create the collection reference
                const collectionRef = cloudFirestore.database.collection(collectionName);

                // Iterate through each document in the collection
                for (const documentId in documents) {
                    if (documents.hasOwnProperty(documentId)) {
                        const documentData = documents[documentId];
                        console.log(documentId, documentData);

                        // Create or update the document with the respective ID and data
                        //await collectionRef.doc(documentId).set(documentData);
                    }
                }
            }
        }

        console.log('Data restored successfully!');
    } catch (error) {
        console.error('Error restoring data:', error);
    }
}

// Invoke the restoreCollections function
restoreCollections();
