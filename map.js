import Marker from "./marker.js";

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
    // const x = -2203,
    //   y = -1031,
    //   newX = Math.abs(this.origin.x - x) / 3764 * 840 + 64.7,
    //   newY = 969.7 - Math.abs((this.origin.y - y) / 4090 * 923.7);
    // console.log("x pos: " + newX);
    // console.log("y pos: " + newY);

    const deaths = [
      { x: -472.41571044921875, y: 2080.86474609375 },
      { x: -1268.6517333984375, y: 2673.19287109375 },
      { x: 1636.776123046875, y: 311.1758728027344 },
      { x: 1380.0743408203125, y: 692.2906494140625 },
      { x: 1380.0743408203125, y: 692.2906494140625 },
      { x: 1069.03125, y: 2368.286865234375 },
      { x: 1069.03125, y: 2368.286865234375 },
      { x: -605.96875, y: 1800.888916015625 },
      { x: -605.96875, y: 1800.888916015625 },
      { x: 1240.0078125, y: 2615.75 },
      { x: 1240.0078125, y: 2615.75 }
    ];

    let location = (this.image.onload = () => {
      this.ctx.drawImage(this.image, 0, 0, this.width, this.height);
      deaths.forEach(death => {
        let marker = new Marker(this.ctx, this.origin, death.x, death.y);
        marker.render();
      });
    });
  }
}

export default Map;
