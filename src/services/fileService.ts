import * as fs from 'fs';

class FileService {
    writeFileSync(filePath: string, fileContent: string) {
        fs.writeFileSync(filePath, fileContent, 'utf8');
    }

    deleteFileSync(filePath: string) {
        fs.unlinkSync(filePath);
    }

    deleteFilesSync(filePaths: string[]) {
        filePaths.forEach((filePath) => {
            if (filePath) {
                this.deleteFileSync(filePath);
            }
        });
    }

    readFileSync(filePath: string, encoding: BufferEncoding): string {
        return fs.readFileSync(filePath, encoding);
    }


    readFileSyncBase64(filePath: string): string {
        return fs.readFileSync(filePath).toString('base64');
    }
}

export default new FileService();
