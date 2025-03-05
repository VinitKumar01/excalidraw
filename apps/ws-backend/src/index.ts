import { WebSocketServer } from "ws";

const wss = new WebSocketServer({port: 8080});

wss.on("connection", function connection(ws) {
    console.log("Connected");
    ws.on("message", function message(data) {
        ws.send("pong in response to " + data);
    });
});