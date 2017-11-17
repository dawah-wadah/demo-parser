import h337 from "heatmap.js";
import fetchGrenades from "./base.js";

const heatmapConfig = {
  container: document.getElementById("heatmap"),
  radius: 8,
  maxOpacity: 0.9,
  minOpacity: 0.4,
  blur: 0.75,
  gradient: {
    // enter n keys between 0 and 1 here
    // for gradient color customization
    '.3': 'dimgray',
    '.3': 'darkgray',
    '1': 'gray'
  }
};

function configureColor(data) {
  let colors = {
    ".5": "gray",
    ".8": "darkgray",
    ".95": "dimgray"
  }

  switch (data) {
    case "deaths":
      colors = { ".3": "yellow", ".4": "orange", "1": "red" };
      break;
    case "kills":
      colors = { ".3": "white", ".4:": "aqua", "1": "blue" };
      break;
    case "Flashbang":
      colors = { ".2": "black", ".3": "floralwhite", ".4:": "snow", "1": "white" }
      break;
    case "High Explosive Grenade":
      colors = { ".3": "wheat", ".4": "olive", "1": "seagreen" };
      break;
    case "Smoke Grenade":
      colors = { ".3": "dimgray", ".4": "darkgray", "1": "gray" };
  default:
  }
}

const heatmapInstance = h337.create(heatmapConfig);

export const showOnMap = (data) => {
  let mapData = [];

  for (let key in data) {
    const { x, y } = data[key].location.victim;
    console.log(x, y)
    let xPos = Math.floor(Math.abs(x - -2203) / 3764 * 840 + 64.7);
    let yPos = Math.floor(969.7 - Math.abs((y - -1031) / 4090 * 923.7));

    mapData.push({ x: xPos, y: yPos, value: 10 });
  }

  heatmapInstance.setData({ max: 10, data: mapData });
}

export const renderMap = () => {
  fetchGrenades().then(gg => showOnMap(gg))
};
