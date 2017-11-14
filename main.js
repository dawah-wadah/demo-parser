import h337 from 'heatmap.js';
import * as firebase from "firebase";
import { initializeFB } from './base.js';
import * as deaths from './data.json';

document.addEventListener("DOMContentLoaded", () => {
  initializeFB();
  firebase.database().ref('/deaths').push(deaths);

  const heatmapConfig = {
    container: document.getElementById('heatmap'),
    radius: 13,
    maxOpacity: .5,
    minOpacity: 0,
    blur: .75
  };

  const deathData = [];
  console.log(deaths);
  for (let entry in deaths) {
    const {x, y} = deaths[entry].location.victim;

    let xPos = Math.floor(Math.abs(x - (-2203)) / 3764 * 840 + 64.7);
    let yPos = Math.floor(969.7 - Math.abs((y - (-1031)) / 4090 * 923.7));

    deathData.push({ x: xPos, y: yPos, value: 10 });
  }

  // create heatmap with configuration
  const heatmapInstance = h337.create(heatmapConfig);

  const data = {
    max: 10,
    data: deathData
  }
  //
  heatmapInstance.setData(data);
});
