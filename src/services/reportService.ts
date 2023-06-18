import { report } from "process";
import Helpers from "../shared/helpers";
import { IProductDetail, IReportData, IReportJSON } from "../shared/interfaces";
import electrictyCalculator from "./electrictyCalculator";
import fileService from "./fileService";
import weatherService from "./weather/weather";
import * as os from 'os';
import * as path from 'path';

class ReportService {
    async generateReport(product: IProductDetail): Promise<string> {
        try {
            const weatherData = await weatherService.getLast30DaysWeatherData(product.region);
            return this.generateCSV(product, weatherData);
        }
        catch {

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
        catch {

        }
        return {
            datetimes: [],
            electrictyProduced: [],
        };
    }

    private generateCSV(product: IProductDetail, weatherData: IReportData): string {
        try {

            const csvName = `weather-${product.id}-${Date.now()}.csv`;
            const csvPath = this.getTempFilePath(csvName);

            // Extract all unique datetimes
            const datetimes = Array.from(new Set(Object.values(weatherData).flatMap((arr) => arr.map((obj) => obj.datetime))));

            // Prepare the CSV header row
            const dates = Object.keys(weatherData);
            const csvHeaderRow = ['Time\\Date', ...dates].join(',');

            // Prepare the CSV data rows
            const csvDataRows = datetimes.map((datetime) => {
                const rowData = [datetime];
                const rowDataByDate = Object.entries(weatherData).reduce((acc, [date, values]) => {
                    const entry = values.find((obj) => obj.datetime === datetime);
                    const solarRadiation = entry?.solarradiation ?? 0;
                    let electricityGenerated = 0;
                    const powerConversionEfficiency = 1;
                    if (solarRadiation) {
                        electricityGenerated = electrictyCalculator.calculateElectricityProduced(
                            solarRadiation,
                            product.power_peak,
                            product.orientation,
                            product.tiltAngle,
                            product.area,
                            product.num_panels,
                            powerConversionEfficiency
                        );
                    }
                    entry.electricityGenerated = electricityGenerated;
                    acc[date] = electricityGenerated;
                    return acc;
                }, {});
                dates.forEach((date) => {
                    rowData.push(rowDataByDate[date]);
                });
                return rowData.join(',');
            });

            // Calculate the sum of values for each date
            const sumByDate = Object.entries(weatherData).reduce((acc, [date, values]) => {
                const sum = values.reduce((total, obj) => total + obj.electricityGenerated, 0);
                acc[date] = sum;
                return acc;
            }, {});

            // Prepare the row with the sums for each date
            const sumRow = ['TOTAL', ...dates.map((date) => sumByDate[date])].join(',');

            // Combine header, data, sum rows
            const csvContent = [csvHeaderRow, ...csvDataRows, sumRow].join('\n');

            fileService.writeFileSync(csvPath, csvContent);

            console.log(`CSV file created! (${product.id})`);

            return csvPath;
        }
        catch { }
        return '';
    }

    private getTempFilePath(fileName: string) {
        const tempFolderPath = os.tmpdir();
        const filePath = path.join(tempFolderPath, fileName);
        return filePath;
    }

    private generateJSON(product: IProductDetail, weatherData: IReportData): IReportJSON {

        const xAxis: string[] = [];
        const yAxis: number[] = [];

        try {

            const sortedDatesData = Helpers.sortObjectKeys(weatherData) as IReportData;

            Object.entries(sortedDatesData).forEach(([date, timeValues]) => {
                Object.values(timeValues).forEach((timeValue) => {
                    const solarRadiation = timeValue?.solarradiation ?? 0;
                    let electricityGenerated = 0;
                    const powerConversionEfficiency = 1;
                    if (solarRadiation) {
                        electricityGenerated = electrictyCalculator.calculateElectricityProduced(
                            solarRadiation,
                            product.power_peak,
                            product.orientation,
                            product.tiltAngle,
                            product.area,
                            product.num_panels,
                            powerConversionEfficiency
                        );
                    }

                    xAxis.push(`${date} ${timeValue.datetime}`);
                    yAxis.push(electricityGenerated);
                });
            });
        }
        catch {

        }

        const reportJson: IReportJSON = {
            datetimes: xAxis,
            electrictyProduced: yAxis,
        };

        return reportJson;
    }
}


export default new ReportService();
