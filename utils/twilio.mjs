import twilio from 'twilio';

export const Client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);