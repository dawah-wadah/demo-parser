class Marker {
  constructor(ctx, origin, xPos, yPos) {
    this.ctx = ctx;
    this.origin = origin;
    this.xPos = Math.abs(this.origin.x - xPos) / 3764 * 840 + 64.7;
    this.yPos = 969.7 - Math.abs((this.origin.y - yPos) / 4090 * 923.7);
  }

  render() {
    this.ctx.beginPath();
    this.ctx.arc(this.xPos, this.yPos, 10, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = "red";
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "#003300";
    this.ctx.stroke();
  }
}

export default Marker;
