import Map from "./map.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 1024;
  canvas.height = 1024;
  const map = new Map(canvas, ctx, canvas.width, canvas.height);
  map.render();
});
