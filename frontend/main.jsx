import Header from "./header";
import Mainpage from "./mainpage";
import Footer from "./footer";
import initializeFB from "../base.js";
import Player from './playerPage.jsx'

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
          <Switch>
            <Route exact path="/" component={Mainpage} />
            <Route path="/players/:id" component={Player} />
          </Switch>
          <Footer />
        </div>
      </HashRouter>
    );
  }
}
