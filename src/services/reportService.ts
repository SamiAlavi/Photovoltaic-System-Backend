import { IProductDetail, IReportData } from "../shared/interfaces";
import electrictyCalculator from "./electrictyCalculator";
import fileService from "./fileService";
import weatherService from "./weather/weather";
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

class ReportService {
    async generateReport(product: IProductDetail): Promise<string> {
        try {
            const weatherData = await weatherService.getWeatherData(product.region);
            return this.generateCSV(product, weatherData);
        }
        catch {

        }
        return '';
    }

    private generateCSV(product: IProductDetail, data: IReportData): string {
        try {

            const csvName = `weather-${product.id}-${Date.now()}.csv`;
            const csvPath = this.getTempFilePath(csvName);

            // Extract all unique datetimes
            const datetimes = Array.from(new Set(Object.values(data).flatMap((arr) => arr.map((obj) => obj.datetime))));

            // Prepare the CSV header row
            const dates = Object.keys(data);
            const csvHeaderRow = ['Time\\Date', ...dates].join(',');

            // Prepare the CSV data rows
            const csvDataRows = datetimes.map((datetime) => {
                const rowData = [datetime];
                const rowDataByDate = Object.entries(data).reduce((acc, [date, values]) => {
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
            const sumByDate = Object.entries(data).reduce((acc, [date, values]) => {
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
}


export default new ReportService();
