import Heatmap from "./frontend/heat";
import Data from "./frontend/data";
import KDChart from "./frontend/kd_chart";
import Body from "./frontend/body";
import Header from "./frontend/header";
import Mainpage from "./frontend/mainpage";
import Footer from "./frontend/footer";
import Foo from './frontend/foo.jsx'
import initializeFB from "./base.js";
import Player from './frontend/playerPage.jsx'

import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route, HashRouter } from "react-router-dom";
import WeaponsChart from "./frontend/weapons_chart";

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
          <Switch>
            <Route exact path="/" component={Mainpage} />
            <Route path="/players/:id" component={Player} />
            <Route exact path="/player/:id/kd" component={KDChart} />
            <Route exact path="/body" component={Body} />
            <Route exact path="/foo" component={Foo} />
            <Route exact path="/bar" component={WeaponsChart} />
          </Switch>
          <Footer />
        </div>
      </HashRouter>
    );
  }
}