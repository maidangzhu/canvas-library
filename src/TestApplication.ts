import {Canvas2DApplication} from "./application";

export class TestApplication extends Canvas2DApplication {
  public render(): void {
    if (this.context2D) {
      // clear the whole canvas before render other stuff
      this.context2D.clearRect(0, 0, this.context2D.canvas.width, this.context2D.canvas.height);
    }
  }

  private _drawRect(x: number, y: number, w: number, h: number) {
    if (this.context2D) {
      // always using save-store pair before rendering
      this.context2D.save();
      this.context2D.fillStyle = "grey";
      this.context2D.strokeStyle = "blue";
      this.context2D.lineWidth = 20;
      this.context2D.moveTo(x, y);
      this.context2D.lineTo(x + w, y);
      this.context2D.lineTo(x + w, y + h);
      this.context2D.lineTo(x, y + h);
      this.context2D.closePath();
      this.context2D.stroke();
      this.context2D.fill();
      this.context2D.restore();
    }
  }
}
