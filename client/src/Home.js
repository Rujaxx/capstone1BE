import React, { useState } from "react";

function Home() {
  const [name, setname] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <input
        placeholder="PLease Enter Name"
        value={name}
        onChange={(e) => setname(e.target.value)}
        style={{ margin: "2rem", width: "10%" }}
      />
      <a href={`/game?name=${name}`} style={{ margin: "2rem", width: "10%" }}>
        Join{" "}
      </a>
    </div>
  );
}

export default Home;
