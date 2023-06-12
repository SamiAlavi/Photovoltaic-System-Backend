import * as fs from 'fs';

class FileService {
    writeFileSync(filePath: string, fileContent: string) {
        fs.writeFileSync(filePath, fileContent, 'utf8');
    }

    deleteFileSync(filePath) {
        fs.unlinkSync(filePath);
    }

    readFileSyncBase64(filePath: string): string {
        return fs.readFileSync(filePath).toString('base64');
    }
}

export default new FileService();
