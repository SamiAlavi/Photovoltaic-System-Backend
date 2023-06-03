class Helpers {
    static getQueryParameters(queryParams: {}): string {
        return Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join("&");
    }

    static mapper<T1 extends Object, T2 extends Object>(source: T1) {
        const destination: T2 = {} as T2;
        Object.assign(destination, source);
        return destination;
    }
}

export default Helpers;
