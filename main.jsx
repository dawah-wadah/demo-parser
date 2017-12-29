import Heatmap from "./frontend/heat.js";
import Data from "./frontend/data.jsx";
import KDChart from "./frontend/kd_chart.jsx";
import Body from "./frontend/body.jsx";
import initializeFB from "./base.js";
import Player from './frontend/playerPage.jsx'

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
          <Switch>
            <Route exact path="/" component={Heatmap} />
            <Route exact path="/player/:id/weapons" component={Data} />
            <Route exact path="/player/:id/kd" component={KDChart} />
            <Route exact path="/body" component={Body} />
            <Route exact path="/foo" component={Player} />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}
