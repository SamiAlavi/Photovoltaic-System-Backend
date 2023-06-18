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

    static sortObjectKeys(object: Object): Object {
        const sortedArray = Object.entries(object).sort();
        const sortedObj = Object.fromEntries(sortedArray);
        return sortedObj;
    }
}

export default Helpers;
