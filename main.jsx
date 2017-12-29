import Heatmap from "./frontend/heat.js";
import Data from "./frontend/data.jsx";
import KDChart from "./frontend/kd_chart.jsx";
import Body from "./frontend/body.jsx";
import Header from "./frontend/header";
import Mainpage from "./frontend/mainpage";
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
          <Header />
          <Mainpage />
          <Switch>
            <Route exact path="/" component={Heatmap} />
            <Route exact path="/player/:id/weapons" component={Data} />
            <Route exact path="/player/:id/kd" component={KDChart} />
            <Route exact path="/body" component={Body} />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}
