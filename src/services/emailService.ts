import environment from "../../env";
import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/mail';
import { IProductDetail } from "../shared/interfaces";
import fileService from "./fileService";

class EmailService {
    private verifiedSender = environment.SENDGRID_VERIFIEDSENDER;

    constructor() {
        sgMail.setApiKey(environment.APIKEY_SENDGRID);
    }

    private createProductTableRow(product: IProductDetail) {
        const { id, name, region, model, timestamp } = product;
        const date = (new Date(timestamp)).toUTCString();
        return this.createTableRow([id, name, region, model, date], false, "");
    }

    private createTableRow(values: string[], isHeader: boolean, style: string): string {
        const tag = isHeader ? "th" : "td";
        return `<tr ${style}>${values.map((value) => `<${tag}>${value}</${tag}>`).join('')}</tr>`;
    }

    async sendEmail(userEmail: string, filePaths: string[], products: IProductDetail[]) {
        filePaths = filePaths.filter((filePath) => !!filePath);
        const attachments = [];
        const headers = ["ID", "Name", "Region", "Model", "Product Created At"];
        const isSingular = filePaths.length === 1;
        let count = 0;
        let html = 'Here ';
        if (isSingular) {
            html += 'is your report for the following product';
        }
        else {
            html += 'are your reports for the following products';
        }
        html += ':<br><table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">';
        html += this.createTableRow(headers, true, 'style="background-color: #f2f2f2;"');

        for (let i = 0; i < filePaths.length; i++) {
            const filePath = filePaths[i];
            const product = products[i];
            const fileName = `Report_${product.name}_${product.id}.csv`;
            attachments.push({
                content: fileService.readFileSyncBase64(filePath),
                filename: fileName,
                type: 'text/csv',
                disposition: 'attachment',
            });
            html += this.createProductTableRow(product);
            count++;
        }
        html += '</table>';
        const msg: MailDataRequired = {
            to: userEmail,
            from: this.verifiedSender,
            subject: `Electricity Reports Generated (${count})`,
            html: html,
            attachments: attachments,
        };
        if (count) {
            sgMail.send(msg);
        }

    }
}

export default new EmailService();
