import {Canvas2DApplication} from "./application";

export class TestApplication extends Canvas2DApplication {
  private _lineDashOffset: number = 0;

  public render() {
    if (this.context2D) {
      this.context2D.clearRect(0, 0, this.canvas.width , this.canvas.height);
      this._drawRect(10, 10, this.canvas.width - 20, this.canvas.height - 20);
    }
  }

  public start() {
    this.addTimer((id: number, data: any): void => {
      this.timeCallback(id, data);
    }, 0.05);

    super.start();
  }

  private _drawRect(x: number, y: number, w: number, h: number) {
    if (this.context2D) {
      this.context2D.save();
      this.context2D.fillStyle = "grey";
      this.context2D.strokeStyle = "black";
      this.context2D.lineWidth = 2;
      this.context2D.setLineDash( [ 2, 5 ] );
      this.context2D.lineDashOffset = this._lineDashOffset;
      this.context2D.beginPath();
      this.context2D.moveTo(x, y);
      this.context2D.lineTo(x + w, y);
      this.context2D.lineTo(x + w, y + h);
      this.context2D.lineTo(x, y + h);
      this.context2D.closePath();
      this.context2D.fill();
      this.context2D.stroke();
      this.context2D.restore();
    }
  }

  public timeCallback(id: number, data: any) {
    this._updateLineDashOffset();
  }

  private _updateLineDashOffset() {
    this._lineDashOffset++;

    if (this._lineDashOffset > 10000) {
      this._lineDashOffset = 0;
    }
  }

  public printLineStates() {
    if (this.context2D) {
      console.log(" ＊＊＊＊＊＊＊＊＊LineState＊＊＊＊＊＊＊＊＊＊ ");
      console.log(" lineWidth : " + this.context2D.lineWidth);
      console.log(" lineCap : " + this.context2D.lineCap);
      console.log(" lineJoin : " + this.context2D.lineJoin);
      console.log(" miterLimit : " + this.context2D.miterLimit);
    }
  }

  public printTextStates() {
    if (this.context2D) {
      console.log(" ＊＊＊＊＊＊＊＊＊TextState＊＊＊＊＊＊＊＊＊＊ ");
      console.log(" font : " + this.context2D.font);
      console.log(" textAlign : " + this.context2D.textAlign);
      console.log(" textBaseline : " + this.context2D.textBaseline);
    }
  }
}
