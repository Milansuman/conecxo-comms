import { logger } from "./logger";
import twilio from 'twilio';
// import { AccessToken } from 'twilio';
// import { VoiceGrant } from 'twilio/lib/jwt/AccessToken';
import process from "node:process"

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
// const VoiceResponse = twilio.twiml.VoiceResponse;

// const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
// const twilioApiKey = process.env.TWILIO_API_KEY;
// const twilioApiSecret = process.env.TWILIO_API_SECRET;
// const outgoingApplicationSid = 'AP44d5ac4b53133d326f5730ce13f4a905';
// const identity = "+13477516566";

// export const generateApiKey = (): string => {
//     const voiceGrant = new VoiceGrant({
//         outgoingApplicationSid: outgoingApplicationSid
//     });
    
//     const token = new AccessToken(
//         twilioAccountSid!,
//         twilioApiKey!,
//         twilioApiSecret!,
//         { identity: identity }
//     );
//     token.addGrant(voiceGrant);
//     return token.toJwt();
// }

// export const placeCall = (phone: string): string => {
//     const response = new VoiceResponse();
//     const dial = response.dial({
//         callerId: "+12129230408"
//     });
//     dial.number(phone);
//     return response.toString();
// }

export const sendWhatsappMessage = (phone: string, contents: string): void => {
    client.messages.create({
        from: "whatsapp:+14155238886",
        to: `whatsapp:${phone}`,
        body: contents
    }).then(message => logger.info(message)).catch(err => {
        logger.error(err);
        console.log(err.code);
        if (err.code === "ERR_SOCKET_CONNECTION_TIMEOUT") {
            sendWhatsappMessage(phone, contents);
        }
    });
}

// export const sendMessage = (phone: string, contents: string, media?: string): void => {
//     const messageOptions = {
//         to: phone,
//         from: media ? "+13477516566" : "+15855342306",
//         body: contents,
//     };

//     if (media) {
//         messageOptions.mediaUrl = media;
//     }

//     client.messages.create(messageOptions)
//         .then(message => logger.info(message.sid))
//         .catch(err => {
//             logger.error(err);
//             console.log(err.code);
//             if (err.code === "ERR_SOCKET_CONNECTION_TIMEOUT") {
//                 sendMessage(phone, contents, media);
//             }
//         });
// }