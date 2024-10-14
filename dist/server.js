"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const logger_1 = require("./logger");
const communication_1 = require("./communication");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const server = app.listen(8000, () => console.log("Started listening on localhost:8000"));
const wss = new ws_1.WebSocketServer({ server });
let clients = [];
app.get("/ping", (req, res, next) => {
    res.send("pong");
});
wss.on("connection", (ws) => {
    clients.push(ws);
    ws.on("error", (err) => logger_1.logger.error(err));
    ws.on("message", (data, isBinary) => {
        try {
            const message = JSON.parse(data.toString('utf-8'));
            console.log(message);
            (0, communication_1.sendWhatsappMessage)(message.phone, message.contents);
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    });
    ws.on("close", (code, reason) => {
        logger_1.logger.info(`Websocket closed due to ${code}: ${reason}`);
        clients = clients.filter(client => client !== ws);
    });
});
app.post("/incoming", (req, res, next) => {
    console.log(req.body);
    for (let client of clients) {
        console.log(client.readyState);
        client.send(JSON.stringify(req.body));
    }
    res.sendStatus(200);
});
// server.on("upgrade", (req, socket, head) => {
//     if(wss.shouldHandle(req)){
//         wss.handleUpgrade(req, socket, head, (ws, req) => {
//             wss.emit("connection", ws, req);
//         })
//     }
// })
