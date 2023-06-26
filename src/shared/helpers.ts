import * as os from 'os';
import * as path from 'path';
import { Response } from 'express';

class Helpers {
    static getQueryParameters(queryParams: {}): string {
        return Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join("&");
    }

    static getFormattedDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    static getFormattedTime(date: Date): string {
        const currentHour = date.getHours();
        const formattedDate = `${currentHour}:00:00`;
        return formattedDate;
    }

    static sortObjectKeys(object: Object): Object {
        const sortedArray = Object.entries(object).sort();
        const sortedObj = Object.fromEntries(sortedArray);
        return sortedObj;
    }

    static getTempFilePath(fileName: string) {
        const tempFolderPath = os.tmpdir();
        const filePath = path.join(tempFolderPath, fileName);
        return filePath;
    }

    static handleError(res: Response, error: Error) {
        console.log(error);
        const response = {
            message: error.message,
        };
        res.status(400).json(response);
    }
}

export default Helpers;
