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

    private createTableRow(product: IProductDetail) {
        const { name, id, model, timestamp } = product;
        return `<tr><td>${name}</td><td>${id}</td><td>${model}</td><td>${new Date(timestamp)}</td></tr>`;
    }

    async sendEmail(userEmail: string, filePaths: string[], products: IProductDetail[]) {
        const attachments = [];
        let count = 0;
        let html = 'Here are your reports for following products:<br>';
        html += '<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">';
        html += '<tr style="background-color: #f2f2f2;"><th>Name</th><th>ID</th><th>Model</th><th>Created At</th></tr>';

        for (let i = 0; i < filePaths.length; i++) {
            const filePath = filePaths[i];
            if (filePath) {
                const product = products[i];
                const fileName = `Report-${product.name}(${product.id}).csv`;
                attachments.push({
                    content: fileService.readFileSyncBase64(filePath),
                    filename: fileName,
                    type: 'text/csv',
                    disposition: 'attachment',
                });
                html += this.createTableRow(product);
                count++;
            }
        }
        html += '</table>';
        const msg: MailDataRequired = {
            to: "sami.mansooralavi1999@gmail.com",
            from: this.verifiedSender,
            subject: `Reports Generated (${count})`,
            html: html,
            attachments: attachments,
        };
        const response = await sgMail.send(msg);
    }
}

export default new EmailService();
