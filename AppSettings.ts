class AppSettings {
    static Project = "/project";
    static Product = "/product";

    static RouteBase = "/";
    static RouteId = `${this.RouteBase}:id`;
    static RouteApi = `/api`;
    static RouteSignup = `/signup`;
    static RouteSignin = `/signin`;
    static RouteSignout = `/signout`;
    static RouteProject = `${this.RouteApi}${this.Project}`;
    static RouteProduct = `${this.RouteApi}${this.Product}`;
    static RouteAddProduct = `${this.Product}`;
}

export default AppSettings;
