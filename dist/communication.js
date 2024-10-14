"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.sendWhatsappMessage = exports.placeCall = exports.generateApiKey = void 0;
const logger_1 = require("./logger");
const twilio_1 = __importDefault(require("twilio"));
const twilio_2 = require("twilio");
const AccessToken_1 = require("twilio/lib/jwt/AccessToken");
const node_process_1 = __importDefault(require("node:process"));
const accountSid = node_process_1.default.env.TWILIO_ACCOUNT_SID;
const authToken = node_process_1.default.env.TWILIO_AUTH_TOKEN;
const client = (0, twilio_1.default)(accountSid, authToken);
const VoiceResponse = twilio_1.default.twiml.VoiceResponse;
const twilioAccountSid = node_process_1.default.env.TWILIO_ACCOUNT_SID;
const twilioApiKey = node_process_1.default.env.TWILIO_API_KEY;
const twilioApiSecret = node_process_1.default.env.TWILIO_API_SECRET;
const outgoingApplicationSid = 'AP44d5ac4b53133d326f5730ce13f4a905';
const identity = "+13477516566";
const generateApiKey = () => {
    const voiceGrant = new AccessToken_1.VoiceGrant({
        outgoingApplicationSid: outgoingApplicationSid
    });
    const token = new twilio_2.AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret, { identity: identity });
    token.addGrant(voiceGrant);
    return token.toJwt();
};
exports.generateApiKey = generateApiKey;
const placeCall = (phone) => {
    const response = new VoiceResponse();
    const dial = response.dial({
        callerId: "+12129230408"
    });
    dial.number(phone);
    return response.toString();
};
exports.placeCall = placeCall;
const sendWhatsappMessage = (phone, contents) => {
    client.messages.create({
        from: "whatsapp:+14155238886",
        to: `whatsapp:${phone}`,
        body: contents
    }).then(message => logger_1.logger.info(message)).catch(err => {
        logger_1.logger.error(err);
        console.log(err.code);
        if (err.code === "ERR_SOCKET_CONNECTION_TIMEOUT") {
            (0, exports.sendWhatsappMessage)(phone, contents);
        }
    });
};
exports.sendWhatsappMessage = sendWhatsappMessage;
const sendMessage = (phone, contents, media) => {
    const messageOptions = {
        to: phone,
        from: media ? "+13477516566" : "+15855342306",
        body: contents,
    };
    if (media) {
        messageOptions.mediaUrl = media;
    }
    client.messages.create(messageOptions)
        .then(message => logger_1.logger.info(message.sid))
        .catch(err => {
        logger_1.logger.error(err);
        console.log(err.code);
        if (err.code === "ERR_SOCKET_CONNECTION_TIMEOUT") {
            (0, exports.sendMessage)(phone, contents, media);
        }
    });
};
exports.sendMessage = sendMessage;
