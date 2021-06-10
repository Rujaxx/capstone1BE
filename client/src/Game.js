import React, { useEffect, useState } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { useHistory } from "react-router-dom";
const ENDPOINT = "http://localhost:8000";

function Game({ location }) {
  const history = useHistory();
  const [name, setName] = useState("");
  const [gameData, setgameData] = useState([
    "--",
    "--",
    "--",
    "--",
    "--",
    "--",
    "--",
    "--",
    "--",
  ]);
  const handleClick = (user, id) => {
    const temp = [...gameData];
    if (temp[id] === "--") {
      temp[id] = user?.substring(0, 2);
      setgameData(temp);
    }
  };

  useEffect(() => {
    const { name } = queryString.parse(location.search);
    if (name === "") {
      history.goBack();
    }
    setName(name);
    let socket = io.connect(ENDPOINT);
    // socket.emit("join", { name });
    // return () => {
    //   if (socket) {
    //     socket.emit("disconnect");
    //     socket.off();
    //   }
    // };
  }, [history, location.search]);
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
                  padding: "1rem",
                  border: "black 1px solid",
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
                  padding: "1rem",
                  border: "black 1px solid",
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
                  padding: "1rem",
                  border: "black 1px solid",
                }}
              >
                {gameData[id]}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Game;
