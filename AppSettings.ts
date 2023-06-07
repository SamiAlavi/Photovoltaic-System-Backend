class AppSettings {
    static RouteBase = "/";
    static RouteApi = "/api";
    static RouteSignup = "/signup";
    static RouteSignin = "/signin";
    static RouteSignout = "/signout";
    static RouteProject = `${this.RouteApi}/project`;
    static RouteId = `${this.RouteBase}:id`;
}

export default AppSettings;
