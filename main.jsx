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

// import * as deaths from "./data.json";

// document.addEventListener("DOMContentLoaded", () => {
//
//
//   renderMap();
//   // initializeFB();
//   // // firebase.database().ref('/deaths').push(deaths);
//   // let grenades;
//   // const deathData = [];
//   // firebase
//   //   .database()
//   //   .ref("/hlebopek/de_dust2/Counter-Terrorist/deaths")
//   //   .on("value", snapshot => {
//   //     console.log("got shit");
//   //     grenades = snapshot.val();
//   //     for (let keys in grenades) {
//   //       const { x, y } = grenades[keys];
//   //       let xPos = Math.floor(Math.abs(x - -2203) / 3764 * 840 + 64.7);
//   //       let yPos = Math.floor(969.7 - Math.abs((y - -1031) / 4090 * 923.7));
//   //     }
//   //   });
// });
