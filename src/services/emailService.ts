import environment from "../../env";
import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/mail';
import { IProductDetail } from "../shared/interfaces";
import fileService from "./fileService";

class EmailService {
    private verifiedSender = "meyditutri@gufum.com";

    constructor() {
        sgMail.setApiKey(environment.APIKEY_SENDGRID);
    }

    async sendEmail(userEmail: string, filePath: string, product: IProductDetail) {
        const msg: MailDataRequired = {
            to: userEmail,
            from: this.verifiedSender,
            subject: 'Report(s) Generated',
            html: 'Here are your reports for following products',
            attachments: [
                {
                    content: fileService.readFileSyncBase64(filePath),
                    filename: `Report-${product.name}.csv`,
                    type: 'text/csv',
                    disposition: 'attachment',
                },
            ],
        };
        const response = await sgMail.send(msg);
    }
}

export default new EmailService();
