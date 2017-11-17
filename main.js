import h337 from "heatmap.js";
import * as firebase from "firebase";
import initializeFB from "./base.js";
import fetchGrenades from "./base.js";
import { renderMap } from "./heat.js"
// import * as deaths from "./data.json";

document.addEventListener("DOMContentLoaded", () => {
  renderMap();

  // const deathData = [];
  // firebase
  //   .database()
  //   .ref("/grenades/de_dust2/High Explosive Grenade")
  //   .on("value", snapshot => {
  //     console.log("got shit");
  //     grenades = snapshot.val();
  //     for (let keys in grenades) {
  //       const { x, y } = grenades[keys];
  //       let xPos = Math.floor(Math.abs(x - -2203) / 3764 * 840 + 64.7);
  //       let yPos = Math.floor(969.7 - Math.abs((y - -1031) / 4090 * 923.7));
  //
  //       deathData.push({ x: xPos, y: yPos, value: 10 });
  //     }
  //     console.log(deathData);
  //
  //     const heatmapConfig = {
  //       container: document.getElementById("heatmap"),
  //       radius: 30,
  //       maxOpacity: 0.5,
  //       minOpacity: 0,
  //       blur: 0.75,
  //       gradient: {
  //         // enter n keys between 0 and 1 here
  //         // for gradient color customization
  //         ".5": "blue",
  //         ".8": "red",
  //         ".95": "white"
  //       }
  //     };
  // // firebase
  // //   .database()
  // //   .ref("/Taylor Swift/de_dust2/Terrorist/kills/")
  // //   .on("value", snapshot => {
  // //     console.log("got shit");
  // //     taylorDeaths = snapshot.val();
  // //     for (let keys in taylorDeaths) {
  // //       const { x, y } = taylorDeaths[keys].location.victim;
  // //       let xPos = Math.floor(Math.abs(x - -2203) / 3764 * 840 + 64.7);
  // //       let yPos = Math.floor(969.7 - Math.abs((y - -1031) / 4090 * 923.7));
  // //
  // //       deathData.push({ x: xPos, y: yPos, value: 10 });
  // //     }
  // //     console.log(deathData);
  // //
  // //     const heatmapConfig = {
  // //       container: document.getElementById("heatmap"),
  // //       radius: 13,
  // //       maxOpacity: 0.5,
  // //       minOpacity: 0,
  // //       blur: 0.75,
  // //       gradient: {
  // //         // enter n keys between 0 and 1 here
  // //         // for gradient color customization
  // //         ".5": "blue",
  // //         ".8": "red",
  // //         ".95": "white"
  // //       }
  // //     };
  //
  //     // console.log(deaths);
  //     // for (let entry in deaths) {
  //     //   const { x, y } = deaths[entry].location.victim;
  //     //
  //     //   let xPos = Math.floor(Math.abs(x - -2203) / 3764 * 840 + 64.7);
  //     //   let yPos = Math.floor(969.7 - Math.abs((y - -1031) / 4090 * 923.7));
  //     //
  //     //   deathData.push({ x: xPos, y: yPos, value: 10 });
  //     // }
  //
  //     // create heatmap with configuration
  //     const heatmapInstance = h337.create(heatmapConfig);
  //
  //     const data = {
  //       max: 10,
  //       data: deathData
  //     };
  //     //
  //     heatmapInstance.setData(data);
  //   });
});
