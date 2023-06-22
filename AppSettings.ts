class AppSettings {
    static FavIconIco = "/favicon.ico";
    static Project = "/project";
    static Product = "/product";
    static Profile = "/profile";
    static Report = "/report";
    static SwaggerJSON = "/swagger.json";

    static RouteBase = "/";
    static RouteSwagger = "/api-docs";
    static RouteSwaggerJSON = `${this.RouteSwagger}${this.SwaggerJSON}`;
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
