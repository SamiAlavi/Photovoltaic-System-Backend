import { IProductDetail, IReport, IReportData } from "../shared/interfaces";
import electrictyCalculator from "./electrictyCalculator";
import weatherService from "./weather/weather";
import * as fs from 'fs';

class ReportService {
    async generateReport(product: IProductDetail): Promise<IReport> {
        const report: IReport = { isGenerated: false, path: '' };
        try {
            const weatherData = await weatherService.getWeatherData(product.region);
            this.generateCSV(product, weatherData);
            //Object.entries(o)
            const a = '';
        }
        catch {

        }
        return report;
    }

    private async generateCSV(product: IProductDetail, data: IReportData): Promise<IReport> {
        const report = { isGenerated: false, path: '' };
        try {

            const csvPath = `weather-${product.id}-${Date.now()}.csv`;

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

            fs.writeFileSync(csvPath, csvContent, 'utf8');

            console.log('CSV file created!');

            report.isGenerated = true;
            report.path = csvPath;
        }
        catch { }
        return report;
    }

    private calculate;

}


export default new ReportService();
