class Map {
  constructor(canvas, ctx, width, height) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = "assets/de_dust2_radar_spectate.jpg";
    this.render = this.render.bind(this);
  }

  render() {
    this.image.onload = () => {
      this.ctx.drawImage(this.image, 0, 0, this.width, this.height);
    };
    this.ctx.font = "20px Georgia";
    this.ctx.fillText("Hello World!", 10, 50);
  }
}

export default Map;
