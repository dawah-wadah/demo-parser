import h337 from "heatmap.js";

const heatmapConfig = {
  container: document.getElementById("heatmap"),
  radius: 30,
  maxOpacity: 0.5,
  minOpacity: 0,
  blur: 0.75,
  gradient: {
    // enter n keys between 0 and 1 here
    // for gradient color customization
    ".5": "blue",
    ".8": "red",
    ".95": "white"
  }
};

const deathData = [];

const heatmapInstance = h337.create(heatmapConfig);

const data = {
  max: 10,
  data: deathData
};

const showOnMap = (data) => {
  let mapData = [];

  for (let key in data) {
    const { x, y } = data[key];
    let xPos = Math.floor(Math.abs(x - -2203) / 3764 * 840 + 64.7);
    let yPos = Math.floor(969.7 - Math.abs((y - -1031) / 4090 * 923.7));

    mapData.push({ x: xPos, y: yPos, value: 10 });
  }

  data.data = mapData;
  heatmapInstance.setData(data);
}
