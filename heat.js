import h337 from "heatmap.js";
import fetchGrenades from "./base.js";

const heatmapConfig = {
  container: document.getElementById("heatmap"),
  radius: 7,
  maxOpacity: 0.5,
  minOpacity: 0,
  blur: 0.75,
  gradient: {
    // enter n keys between 0 and 1 here
    // for gradient color customization
    '0': 'Navy',
    '0.25': 'Blue',
    '0.5': 'Green',
    '0.75': 'Yellow',
    '1': 'Red'
  }
};

function configureColor(data) {
  let colors = {
    ".5": "blue",
    ".8": "red",
    ".95": "white"
  }

  switch (data) {
    case "deaths":

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
