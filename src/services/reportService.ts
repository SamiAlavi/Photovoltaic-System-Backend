import Helpers from "../shared/helpers";
import { IProductDetail, IReportData, IReportJSON } from "../shared/interfaces";
import electrictyCalculator from "./electrictyCalculator";
import fileService from "./fileService";
import weatherService from "./weather/weather";

class ReportService {
    async generateReportCSV(product: IProductDetail): Promise<string> {
        try {
            const weatherData = await weatherService.getLast30DaysWeatherData(product.region);
            return this.generateCSV(product, weatherData);
        }
        catch {

        }
        return '';
    }

    private generateCSV(product: IProductDetail, weatherData: IReportData): string {
        try {

            const csvName = `weather-${product.id}-${Date.now()}.csv`;
            const csvPath = Helpers.getTempFilePath(csvName);
            const sortedDatesData = Helpers.sortObjectKeys(weatherData) as IReportData;

            // Extract all unique datetimes
            const datetimes = Array.from(new Set(Object.values(sortedDatesData).flatMap((arr) => arr.map((obj) => obj.datetime))));

            // Prepare the CSV header row
            const dates = Object.keys(sortedDatesData);
            const csvHeaderRow = ['Time\\Date', ...dates].join(',');

            // Prepare the CSV data rows
            const csvDataRows = datetimes.map((datetime) => {
                const rowData = [datetime];
                const rowDataByDate = Object.entries(sortedDatesData).reduce((acc, [date, values]) => {
                    const dateTimeEntry = values.find((obj) => obj.datetime === datetime) ?? {
                        datetime: datetime,
                        solarradiation: 0,
                    };
                    const solarRadiation = dateTimeEntry.solarradiation ?? 0;
                    let electricityGenerated = 0;
                    if (solarRadiation) {
                        electricityGenerated = electrictyCalculator.calculateElectricityProduced(
                            solarRadiation,
                            product.power_peak, // W
                            product.orientation,
                            product.tiltAngle,
                            product.area, // m^2
                            product.num_panels,
                            product.efficiency,
                        ) / 1000; // units kWh
                    }
                    dateTimeEntry.electricityGenerated = electricityGenerated;
                    acc[date] = electricityGenerated;
                    return acc;
                }, {});
                dates.forEach((date) => {
                    rowData.push(rowDataByDate[date]);
                });
                return rowData.join(',');
            });

            // Calculate the sum of values for each date
            const sumByDate = Object.entries(sortedDatesData).reduce((acc, [date, values]) => {
                const sum = values.reduce((total, obj) => total + obj.electricityGenerated, 0);
                acc[date] = sum;
                return acc;
            }, {});

            // Prepare the row with the sums for each date
            const sumRow = ['TOTAL (kWh)', ...dates.map((date) => sumByDate[date])].join(',');

            // Combine header, data, sum rows
            const csvContent = [csvHeaderRow, ...csvDataRows, sumRow].join('\n');

            fileService.writeFileSync(csvPath, csvContent);

            console.log(`CSV file created! (${product.id})`);

            return csvPath;
        }
        catch (error: any) {
            console.error(error);
        }
        return '';
    }

    async generateReportJSON(product: IProductDetail): Promise<IReportJSON> {
        try {
            const { lng, lat, region } = product;
            await weatherService.addLast30DaysDataInRegion(region, lat, lng);
            const weatherData = await weatherService.getLast30DaysWeatherData(region);
            return this.generateJSON(product, weatherData);
        }
        catch (error: any) {
            throw Error(error.response?.data);
        }
    }

    private generateJSON(product: IProductDetail, weatherData: IReportData): IReportJSON {
        const hourlyXAxis: string[] = [];
        const hourlyYAxis: number[] = [];
        const dailyXAxis: string[] = [];
        const dailyYAxis: number[] = [];

        try {
            const sortedDatesData = Helpers.sortObjectKeys(weatherData) as IReportData;

            Object.entries(sortedDatesData).forEach(([date, timeValues]) => {
                let dailyElectrictyGenerated = 0;
                Object.values(timeValues).forEach((timeValue) => {
                    const solarRadiation = timeValue?.solarradiation ?? 0;
                    let electricityGenerated = 0;
                    if (solarRadiation) {
                        electricityGenerated = electrictyCalculator.calculateElectricityProduced(
                            solarRadiation,
                            product.power_peak,
                            product.orientation,
                            product.tiltAngle,
                            product.area,
                            product.num_panels,
                            product.efficiency
                        );
                    }
                    electricityGenerated /= 1000; //kWh
                    hourlyXAxis.push(`${date} ${timeValue.datetime}`);
                    hourlyYAxis.push(electricityGenerated);
                    dailyElectrictyGenerated += electricityGenerated;
                });
                dailyXAxis.push(date);
                dailyYAxis.push(dailyElectrictyGenerated);
            });
        }
        catch {

        }

        const reportJson: IReportJSON = {
            hourly: {
                datetimes: hourlyXAxis,
                electrictyProduced: hourlyYAxis,
            },
            daily: {
                datetimes: dailyXAxis,
                electrictyProduced: dailyYAxis,
            }
        };

        return reportJson;
    }
}


export default new ReportService();
