import Header from "./header/header";
import Mainpage from "./mainpage/mainpage";
import Player from "./player-page/player-page";
import Creators from "./creators/creators";
import Footer from "./footer/footer";


import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route, HashRouter } from "react-router-dom";
import initializeFB from "./base.js";

initializeFB();
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  ReactDOM.render(<App />, root);
});

export default class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <div id="main-body">
          <Header />
          <Switch>
            <Route exact path="/" component={Mainpage} />
            <Route path="/creators" component={Creators} />
            <Route path="/players/:id" component={Player} />
          </Switch>
          <Footer />
        </div>
      </HashRouter>
    );
  }
}
