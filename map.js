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
    const x = -2203,
      y = -1031,
      newX = (Math.abs(this.origin.x - x)) / 3764 * 840 + 64.7,
      newY = 969.7 - Math.abs((this.origin.y - y) / 4090 * 923.7);
    console.log("x pos: " + newX);
    console.log("y pos: " + newY);
    let location = (this.image.onload = () => {
      this.ctx.drawImage(this.image, 0, 0, this.width, this.height);
      this.ctx.beginPath();
      this.ctx.arc(newX, newY, 10, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = "red";
      this.ctx.fill();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "#003300";
      this.ctx.stroke();
    });
  }
}

export default Map;
