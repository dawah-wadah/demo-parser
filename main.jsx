// import h337 from "heatmap.js";
import * as firebase from "firebase";
// import initializeFB from "./base.js";
// import fetchGrenades from "./base.js";
import Heatmap from "./heat.js";

import React from 'react';
import ReactDOM from 'react-dom';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  ReactDOM.render(<App />, root);
});

class App extends React.Component {
  render() {
    return (
      <Heatmap />
    );
  }
}
