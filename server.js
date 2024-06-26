const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

const logConnection = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

wss.on("connection", (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  const connectionTime = new Date().toLocaleTimeString();
  logConnection(
    `New client connected from IP: ${clientIp} at ${connectionTime}`
  );

  ws.on("message", (message) => {
    logConnection(
      `Received message from IP: ${clientIp} at ${connectionTime}`
    );
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    logConnection(
      `Client from IP: ${clientIp} disconnected at ${new Date().toLocaleTimeString()}`
    );
  });

  ws.send("Welcome to the Push to Talk Server");
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
