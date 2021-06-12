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

//Game State
let gameState = ["", "", "", "", "", "", "", "", ""];

//chat state
let chat = [];
let users = [];
const messages = {
  general: [{ sender: "Samrat", content: "hi from gen" }],
  random: [],
  jokes: [{ sender: "Samrat", content: "hi from jokes" }],
  javascript: [],
};

//socket.io emit connections
io.on("connection", (socket) => {
  console.log("A user just connected.");
  //crazy button takes in data from crazy button and emits it back to the app js
  socket.on("crazyIsClicked", (data) => {
    console.log("id: ", socket.id);
    if (gameState[data?.id] !== "") {
      return io.emit("crazyIsClicked", {
        message: `${data.name} the field is already field up`,
        user: data?.name,
      });
    } else {
      gameState[data?.id] = data?.name?.substring(0, 2);
      return io.emit("crazyIsClicked", {
        data: gameState,
        lastPlayed: data?.name,
      });
    }
  });

  socket.on("newMessage", (data) => {
    console.log("chat", data);
    chat.push(data);
    return io.emit("broadcastMessage", chat.reverse());
  });

  //room
  socket.on("join server", (userName) => {
    const user = {
      userName,
      id: socket.id,
    };
    users.push(user);
    //all member brodcast all user data
    io.emit("new user", users);
  });
  socket.on("join room", (roomName, cb) => {
    // joining a room with roomname
    socket.join(roomName);
    // clint send the callback and we pass the required data
    cb(messages[roomName]);
  });
  socket.on("send message", ({ content, to, sender, chatName, isChanel }) => {
    if (isChanel) {
      const payload = {
        content,
        chatName,
        sender,
      };
      console.log("new message", payload);
      socket.to(to).emit("new message", payload);
    } else {
      const payload = {
        content,
        chatName: sender,
        sender,
      };
      socket.to(to).emit("new message", payload);
    }
    if (messages[chatName]) {
      messages[chatName].push({
        sender,
        content,
      });
    }
  });
  socket.on("disconnect", () => {
    user = users.filter((u) => u.id !== socket.id);
    io.emit("new user", users);
  });
});

server.on("error", (err) => {
  console.error(err);
});

//DEV logging Middleware
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// };

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
