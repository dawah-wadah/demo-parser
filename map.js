import Marker from "./marker.js";
const data = require("./data.json");

class Map {
  constructor(canvas, ctx, width, height) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = "assets/de_dust2_radar_spectate.jpg";
    this.render = this.render.bind(this);
    this.origin = { x: -2203, y: -1031 };
  }


  render() {
    let location = (this.image.onload = () => {
      this.ctx.drawImage(this.image, 0, 0, this.width, this.height);
      // eslint-disable-next-line
      for (var key in data) {
        let marker = new Marker(
          this.ctx,
          this.origin,
          data[key].location.victim.x,
          data[key].location.victim.y,
          "red"
        );

        let killer = new Marker(
          this.ctx,
          this.origin,
          data[key].location.killer.x,
          data[key].location.killer.y,
          "green"
        );
        marker.render();
        killer.render();
      }
    });
  }
}

export default Map;
