class Marker {
  constructor(ctx, origin, xPos, yPos, color) {
    this.ctx = ctx;
    this.origin = origin;
    this.xPos = Math.abs(this.origin.x - xPos) / 3764 * 840 + 64.7;
    this.yPos = 969.7 - Math.abs((this.origin.y - yPos) / 4090 * 923.7);
    this.color = color;
  }

  render() {
    // this.ctx.beginPath();
    // this.ctx.arc(this.xPos, this.yPos, 7, 0, 2 * Math.PI, false);
    // this.ctx.lineWidth = 1;
    // this.ctx.strokeStyle = "#003300";
    // this.ctx.stroke();
    this.ctx.beginPath();

    this.ctx.moveTo(this.xPos - 7, this.yPos - 7);
    this.ctx.lineTo(this.xPos + 7, this.yPos + 7);
    this.ctx.stroke();

    this.ctx.moveTo(this.xPos + 7, this.yPos - 7);
    this.ctx.lineTo(this.xPos - 7, this.yPos + 7);
    this.ctx.fill();
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 5;
    this.ctx.stroke();
  }
}

export default Marker;
