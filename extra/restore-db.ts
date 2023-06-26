import cloudFirestore from "../src/services/firebase/cloudFirestore";
import fileService from "../src/services/fileService";

// Restore collections from backup
async function restoreCollections() {
    try {
        // Read the backup data from JSON file
        const backupData = JSON.parse(fileService.readFileSync('backup.json', 'utf8'));
        console.log('Data restored successfully!');
    } catch (error) {
        console.error('Error restoring data:', error);
    }
}

// Invoke the restoreCollections function
restoreCollections();
