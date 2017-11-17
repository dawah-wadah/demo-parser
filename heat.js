import h337 from "heatmap.js";
import firebase from "firebase";
import initializeFB from "./base.js";

const fetchGrenades = grenade => {
  return firebase
    .database()
    .ref("/grenades/de_dust2/" + grenade + "/")
    .once("value")
    .then(snapshot => snapshot.val());
};

const heatmapConfig = type => ({
  container: document.getElementById("heatmap"),
  radius: 10,
  maxOpacity: 0.5,
  minOpacity: 0,
  blur: 0.75,
  gradient: configureColor(type)
  // {
  //   // enter n keys between 0 and 1 here
  //   // for gradient color customization
  //   "0": "Navy",
  //   "0.25": "Blue",
  //   "0.5": "Green",
  //   "0.75": "Yellow",
  //   "1": "Red"
  // }
});

function configureColor(data) {
  let colors;

  switch (data) {
    case "deaths":
      colors = { ".3": "yellow", ".4": "orange", "1": "red" };
      break;
    case "kills":
      colors = { ".3": "white", ".4": "aqua", "1": "blue" };
      break;
    case "Flashbang":
      colors = { ".2": "black", ".3": "floralwhite", ".4:": "snow", "1": "white" }
      break;
    case "High Explosive Grenade":
      colors = { ".3": "wheat", ".4": "olive", "1": "seagreen" };
      break;
    case "Smoke Grenade":
      colors = { ".3": "dimgray", ".4": "darkgray", "1": "#303030" };
      break;
    default:
      colors = {"1": "black"};
  }

  return colors;
}

export const showOnMap = (data, type) => {
  let mapData = [];

  for (let key in data) {
    const { x, y } = data[key];
    let xPos = Math.floor(Math.abs(x - -2203) / 3764 * 840 + 64.7);
    let yPos = Math.floor(969.7 - Math.abs((y - -1031) / 4090 * 923.7));

    mapData.push({ x: xPos, y: yPos, value: 10 });
  }

  let heatmapInstance = h337.create(heatmapConfig(type));
  heatmapInstance.setData({ max: 10, data: mapData });
};

export const renderMap = () => {
  initializeFB();
  // testing to see if i can have multiple heatmaps
  // the answer is yet, have fun customizing it
  let debug = [
    { grenade: "Decoy", type: "deaths" },
    { grenade: "Smoke Grenade", type: "kills" },
    { grenade: "Flashbang", type: "Smoke Grenade" }
  ];

  debug.forEach(foo => {
    fetchGrenades(foo.grenade).then(grenades => showOnMap(grenades, foo.type));
  });
};
