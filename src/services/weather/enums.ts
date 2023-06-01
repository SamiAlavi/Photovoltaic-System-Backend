enum ResponseFormat {
    JSON = "json",
    XML = "xml",
    HTML = "html",
    CSV = "csv",
}

enum MeasurementUnitOpenWeatherMap {
    STANDARD = "standard", // Kelvin, m/s
    METRIC = "metric", // Celsius, m/s
    IMPERIAL = "imperial", // F, mph, in
}

enum MeasurementUnitWeatherbit {
    METRIC = "M", // Metric (Celsius, m/s, mm)
    SCIENTIFIC = "S", // Scientific (Kelvin, m/s, mm)
    Farenheit = "I", // Fahrenheit (F, mph, in)
}

enum MeasurementUnitVisualCrossing {
    US = "us", // F, mph, in
    METRIC = "metric", // Celsius, km/hr, mm
    UK = "uk", // Celsius, miles/hr, mm
    BASE = "base", // Kelvin, m/s, mm
}

export {
    ResponseFormat,
    MeasurementUnitOpenWeatherMap,
    MeasurementUnitWeatherbit,
    MeasurementUnitVisualCrossing,
};
