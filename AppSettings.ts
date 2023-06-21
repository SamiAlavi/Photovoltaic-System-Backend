class AppSettings {
    static Project = "/project";
    static Product = "/product";
    static Profile = "/profile";
    static Report = "/report";

    static RouteBase = "/";
    static RouteSwagger = "/api-docs";
    static RouteApi = `/api`;
    static RouteSignup = `/signup`;
    static RouteSignin = `/signin`;
    static RouteSignout = `/signout`;
    static RouteProject = `${this.RouteApi}${this.Project}`;
    static RouteProduct = `${this.RouteApi}${this.Product}`;
    static RouteAddEditDeleteProduct = `${this.Product}`;
    static RouteProductReport = `${this.Product}${this.Report}`;
}

export default AppSettings;
