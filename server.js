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
  res.send("SanityCheck");
});

//Load env vars
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
app.use(express.static("public"));

let users = [];
let rooms = [];
const messages = {
  random: [],
};

//socket
io.on("connection", (socket) => {
  console.log("A user just connected.");
  socket.on("join room", (data) => {
    let checkRoomAvailibility = rooms.findIndex(
      (x) => x.name === data.roomName
    );
    if (data?.type === "createRoom") {
      if (checkRoomAvailibility > -1) {
        socket.emit("new room member", {
          status: 400,
          message:
            "Same room already created,Kindly join or create another room",
        });
      } else {
        rooms.push({ name: data.roomName, members: 1 });
        const newUser = {
          ...data,
          id: socket.id,
        };
        users.push(newUser);
        socket.join(data.roomName);
        let roomusers = users.filter((user) => user.roomName === data.roomName);
        io.to(data.roomName).emit("new room member", {
          status: 200,
          data: roomusers,
        });
      }
    } else if (data?.type === "joinFriends") {
      if (checkRoomAvailibility === -1) {
        console.log("im here");
        socket.emit("new room member", {
          status: 400,
          message:
            "No rooms created with the same name., you can create a room",
        });
      } else {
        rooms[checkRoomAvailibility].members =
          rooms[checkRoomAvailibility].members + 1;
        const newUser = {
          ...data,
          id: socket.id,
        };
        users.push(newUser);
        socket.join(data.roomName);
        let roomusers = users.filter((user) => user.roomName === data.roomName);
        io.to(data.roomName).emit("new room member", {
          status: 200,
          data: roomusers,
        });
      }
    }
    //this section for random user
    else {
    }
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
