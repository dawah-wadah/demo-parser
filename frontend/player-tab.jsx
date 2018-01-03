import React from "react";
import { Switch, Route, HashRouter } from "react-router-dom";

import Header from "./header";

const PlayerTabs = () => {
  debugger
  return (
    <Switch>
      <Route exact path="/players/:id" component={Header} />
    </Switch>
  );

};

export default PlayerTabs;