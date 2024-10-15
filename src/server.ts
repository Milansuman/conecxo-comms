import express from "express"
import { WebSocketServer, type WebSocket } from "ws";

import { logger } from "./logger";
import { sendWhatsappMessage } from "./communication";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const server = app.listen(8000, () => console.log("Started listening on localhost:8000"));
const wss = new WebSocketServer({server});

let clients: WebSocket[] = [];

app.get("/ping", (req, res, next) => {
    console.log("pong");
    res.send("pong");
})

wss.on("connection", (ws) => {
    clients.push(ws)
    ws.on("error", (err) => {
        console.error(err)
    });

    ws.on("message", (data, isBinary) => {
        try {
            const message: {contents: string, phone: string} = JSON.parse(data.toString('utf-8'));
            console.log(message)
            sendWhatsappMessage(message.phone, message.contents);
        } catch (error) {
            logger.error(error);
            console.error(error)
        }
    })

    ws.on("close", (code, reason) => {
        logger.info(`Websocket closed due to ${code}: ${reason}`);
        clients = clients.filter(client => client !== ws);
    })
})

app.post("/incoming", (req, res, next) => {
    console.log(req.body)
    for(let client of clients){
        console.log(client.readyState);
        client.send(JSON.stringify(req.body))
    }
    res.sendStatus(200)
});

// server.on("upgrade", (req, socket, head) => {
//     if(wss.shouldHandle(req)){
//         wss.handleUpgrade(req, socket, head, (ws, req) => {
//             wss.emit("connection", ws, req);
//         })
//     }
// })