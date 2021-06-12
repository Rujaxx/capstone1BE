import React, { useEffect, useState } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { useHistory } from "react-router-dom";
const ENDPOINT = "http://localhost:8000";
let socket;

function Game({ location }) {
  const history = useHistory();
  const [name, setName] = useState("");
  const [canIPlay, setCanIPleay] = useState(true);

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const [gameData, setgameData] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  useEffect(() => {
    const { name } = queryString.parse(location.search);
    if (name === "") {
      history.goBack();
    }
    if (!socket) {
      socket = io(ENDPOINT);
    }
    setName(name);
  }, [history, location.search]);
  useEffect(() => {
    socket.on("startGame", (res) => console.log(res));
    return () => {
      if (socket) {
        socket.off();
      }
    };
  }, []);

  useEffect(() => {
    socket.on("crazyIsClicked", (res) => {
      if (res?.message) {
        if (res?.user === name) alert(res?.message);
      } else {
        setgameData(res?.data);
        if (res?.lastPlayed === name) {
          setCanIPleay(false);
        } else {
          setCanIPleay(true);
        }
      }
    });
    socket.on("broadcastMessage", (res) => {
      setChat(res);
    });
  }, [name]);

  const handleClick = (user, id) => {
    if (!canIPlay) {
      alert("Wait for partner to play");
      return;
    }
    console.log("hehe", socket?.id);
    socket.emit("crazyIsClicked", {
      name: user,
      id: id,
    });
  };
  const handleMessage = () => {
    console.log("mess", socket?.id);
    socket.emit("newMessage", {
      name: name,
      message: message,
    });
    setMessage("");
  };
  return (
    <div>
      <h1>Hello {name}</h1>
      <div
        className="board"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div style={{ display: "flex" }}>
          {[0, 1, 2].map((id) => {
            return (
              <span
                onClick={() => handleClick(name, id)}
                key={id}
                style={{
                  margin: "1rem",
                  border: "black 1px solid",
                  minWidth: "50px",
                  minHeight: "50px",
                  textAlign: "center",
                  lineHeight: "50px",
                }}
              >
                {gameData[id]}
              </span>
            );
          })}
        </div>
        <div style={{ display: "flex" }}>
          {[3, 4, 5].map((id) => {
            return (
              <span
                onClick={() => handleClick(name, id)}
                key={id}
                style={{
                  margin: "1rem",
                  border: "black 1px solid",
                  minWidth: "50px",
                  minHeight: "50px",
                  textAlign: "center",
                  lineHeight: "50px",
                }}
              >
                {gameData[id]}
              </span>
            );
          })}
        </div>
        <div style={{ display: "flex" }}>
          {[6, 7, 8].map((id) => {
            return (
              <span
                onClick={() => handleClick(name, id)}
                key={id}
                style={{
                  margin: "1rem",
                  border: "black 1px solid",
                  minWidth: "50px",
                  minHeight: "50px",
                  textAlign: "center",
                  lineHeight: "50px",
                }}
              >
                {gameData[id]}
              </span>
            );
          })}
        </div>

        <div>
          <input
            placeholder="Enter your message"
            value={message}
            onChange={(e) =>
              e.target.value !== "" && setMessage(e.target.value)
            }
          />
          <button onClick={handleMessage}>Send</button>
        </div>
        {chat?.map((item, idx) => {
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "30%",
                marginTop: "1rem",
              }}
            >
              <span>Sender : {item?.name}</span>
              <span>Message: {item?.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Game;
