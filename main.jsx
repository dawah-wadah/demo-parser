import Heatmap from "./frontend/heat.js";
import Data from "./frontend/data.jsx";
import initializeFB from "./base.js";

import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route, HashRouter } from "react-router-dom";

initializeFB();
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  ReactDOM.render(<App />, root);
});

class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <div id="main-body">
          <svg
            width="960"
            height="960"
          />
          <Switch>
            <Route exact path="/" component={Heatmap} />
            <Route exact path="/player/:id" component={Data} />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}
