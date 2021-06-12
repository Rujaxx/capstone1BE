import React, { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import immer from "immer";
import { useHistory } from "react-router-dom";
const ENDPOINT = "http://localhost:8000";
const initialMessagesState = {
  general: [],
  random: [],
  jokes: [],
  javascript: [],
};

function Rooms({ location }) {
  const history = useHistory();
  const socketRef = useRef();
  const [userName, setUserName] = useState("");
  const [connected, setConnected] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessagesState);
  const [msgInput, setMsgInput] = useState("");
  const [connectedRooms, setConnectedRooms] = useState(["general"]);
  const [currentChat, setCurrentChat] = useState({
    isChanel: true,
    chatName: "general",
    receiverID: "",
  });

  useEffect(() => {
    setMsgInput("");
  }, [messages]);

  //initially setting user name
  useEffect(() => {
    const { name } = queryString.parse(location.search);
    if (name === "") {
      history.goBack();
    }
    setUserName(name);
    return () => {
      // socketRef.current.emit("disconnect");
    };
  }, [history, location.search]);

  const sendMessage = () => {
    const payload = {
      content: msgInput,
      sender: userName,
      chatName: currentChat?.chatName,
      isChanel: currentChat?.isChanel,
      to: currentChat?.isChanel
        ? currentChat?.chatName
        : currentChat?.receiverID,
    };
    socketRef.current.emit("send message", payload);
    let newMessage = immer(messages, (draft) => {
      draft[currentChat?.chatName].push({
        sender: userName,
        content: msgInput,
      });
    });
    setMessages(newMessage);
  };

  const roomJoinCallback = (msg, roomname) => {
    let newMessage = immer(messages, (draft) => {
      draft[roomname] = msg;
    });
    setMessages(newMessage);
  };
  const joinRoom = (room) => {
    const newConnectedRooms = immer(connectedRooms, (draft) => {
      draft.push(room);
    });
    socketRef.current.emit("join room", room, (incmsg) =>
      roomJoinCallback(incmsg, room)
    );
    setConnectedRooms(newConnectedRooms);
  };
  const toggleChat = (currentChat) => {
    if (!messages[currentChat?.chatName]) {
      const newMessages = immer(messages, (draft) => {
        draft[currentChat?.chatName] = [];
      });
      setMessages(newMessages);
    }
    setCurrentChat(currentChat);
  };
  //connect function
  const connect = () => {
    if (!connected) {
      setConnected(true);
      socketRef.current = io.connect(ENDPOINT);
      socketRef.current.emit("join server", userName);
      socketRef.current.emit("join room", "general", (msg) =>
        roomJoinCallback(msg, "general")
      );
      socketRef.current.on("new user", (allUsers) => {
        setAllUsers(allUsers);
      });
      socketRef.current.on("new message", ({ content, sender, chatName }) => {
        console.log("ohho", messages);
        // const temp = { ...messages };
        // if (temp[chatName]) {
        //   temp[chatName].push({ content, sender });
        // } else {
        //   temp[chatName] = [{ content, sender }];
        // }
        // setMessages(temp);
      });
    } else {
      console.log("You are already connected");
    }
  };
  return (
    <div>
      {!connected && <button onClick={connect}>Connect</button>}
      {connected && (
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1, height: "100vh" }}>
            <p>Im a {connectedRooms} room</p>
            <input
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
            <ul style={{ borderTop: "1px solid black" }}>
              {messages[connectedRooms]?.map((sngmsg, ind) => {
                return (
                  <li key={ind}>
                    {sngmsg?.sender}:{sngmsg?.content}
                  </li>
                );
              })}
            </ul>
          </div>
          <div
            style={{ flex: 1, borderLeft: "1px solid black", height: "100vh" }}
          >
            Channeles
            <ul style={{ borderTop: "1px solid black" }}>
              {Object.keys(messages)?.map((itm, ind) => {
                return <li key={ind}>{itm}</li>;
              })}
            </ul>
            <ul style={{ borderTop: "1px solid black" }}>
              {allUsers?.map((user) => {
                return (
                  <li key={user?.id}>
                    {user?.userName}
                    {userName === user?.userName && " <- You"}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rooms;
