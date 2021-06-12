import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Game from "./Game";
import Room from "./Room";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/game" component={Game} />
          <Route path="/room" component={Room} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
