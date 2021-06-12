const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
  },
});

const path = require("path");
app.get("/", function (req, res, next) {
  res.send("respond with a Home resource");
});

//Load env vars
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

app.use(express.static("public"));

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
