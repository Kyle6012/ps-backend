import { Client } from '../utils/twilio.mjs';
import { transporter } from '../utils/mailer.mjs';

export const sendNotification = async ({ email, phone, subject, message }) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            text: message
        });

        await Client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE,
            to: phone
        });

        return true;
    } catch (e){
        console.error("Notification error: ", e);
        return false;
    }
};