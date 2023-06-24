enum ResponseFormat {
    JSON = "json",
    XML = "xml",
    HTML = "html",
    CSV = "csv",
}

enum MeasurementUnitVisualCrossing {
    US = "us", // F, mph, in
    METRIC = "metric", // Celsius, km/hr, mm
    UK = "uk", // Celsius, miles/hr, mm
    BASE = "base", // Kelvin, m/s, mm
}

export {
    ResponseFormat,
    MeasurementUnitVisualCrossing,
};
