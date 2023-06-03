export class Helpers {
    static getQueryParameters(queryParams: {}): string {
        return Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join("&");
    }
}
