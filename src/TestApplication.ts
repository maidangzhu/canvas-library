import {Canvas2DApplication} from "./application";

type PatternRepeat = "repeat" | "repeat-x" | "repeat-y" | "no-repeat";

export class TestApplication extends Canvas2DApplication {
  private _lineDashOffset: number = 0;
  private _linearGradient!: CanvasGradient;
  private _radialGradient!: CanvasGradient;
  private _pattern: CanvasPattern | null = null;

  public render() {
    if (this.context2D) {
      this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // this._drawRect(10, 10, this.canvas.width - 20, this.canvas.height - 20);
      this.strokeGrid();
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
      this.context2D.setLineDash([10, 5]);
      this.context2D.lineDashOffset = -this._lineDashOffset;
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

  public fillLinearRect(x: number, y: number, w: number, h: number): void {
    if (this.context2D) {
      this.context2D.save();
      if (this._linearGradient === undefined) {
        this._linearGradient = this.context2D.createLinearGradient(x, y, x + w, y);
        this._linearGradient.addColorStop(0.0, 'grey');
        this._linearGradient.addColorStop(0.25, 'rgba( 255 , 0 , 0 , 1 ) ');
        this._linearGradient.addColorStop(0.5, 'green');
        this._linearGradient.addColorStop(0.75, '#0000FF');
        this._linearGradient.addColorStop(1.0, 'black');
      }
      this.context2D.fillStyle = this._linearGradient;
      this.context2D.beginPath();
      this.context2D.rect(x, y, w, h);
      this.context2D.fill();
      this.context2D.restore();
    }
  }

  public fillRadialRect(x: number, y: number, w: number, h: number): void {
    if (this.context2D) {
      this.context2D.save();
      if (this._radialGradient === undefined) {
        let centX: number = x + w * 0.5;
        let centY: number = y + h * 0.5;
        let radius: number = Math.min(w, h);
        radius *= 0.5;
        this._radialGradient = this.context2D.createRadialGradient(centX, centY, radius * 0.1, centX, centY, radius);
        this._radialGradient.addColorStop(0.0, 'black');
        this._radialGradient.addColorStop(0.25, 'rgba( 255 , 0 , 0 , 1 ) ');
        this._radialGradient.addColorStop(0.5, 'green');
        this._radialGradient.addColorStop(0.75, '#0000FF');
        this._radialGradient.addColorStop(1.0, 'white');
      }
      this.context2D.fillStyle = this._radialGradient;
      this.context2D.fillRect(x, y, w, h);
      this.context2D.restore();
    }
  }

  public fillPatternRect(x: number, y: number, w: number, h: number, repeat: PatternRepeat = "repeat"): void {
    if (this.context2D) {
      if (!this._pattern) {
        let img: HTMLImageElement = document.createElement('img') as HTMLImageElement;
        img.src = '/src/assets/test.jpg';
        img.onload = () => {
          if (this.context2D) {
            this._pattern = this.context2D.createPattern(img, repeat);
            this.context2D.save();
            if (this._pattern) {
              this.context2D.fillStyle = this._pattern;
            }
            this.context2D.beginPath();
            this.context2D.rect(x, y, w, h);
            this.context2D.fill();
            this.context2D.restore();
          }
        }
      } else {
        this.context2D.save();
        this.context2D.fillStyle = this._pattern;
        this.context2D.beginPath();
        this.context2D.rect(x, y, w, h);
        this.context2D.fill();
        this.context2D.restore();
      }
    }
  }

  public fillCircle(x: number, y: number, radius: number, fillStyle:
    string | CanvasGradient | CanvasPattern = 'red') {
    if (this.context2D) {
      this.context2D.save();
      this.context2D.fillStyle = fillStyle;
      this.context2D.beginPath();
      this.context2D.arc(x, y, radius, 0, Math.PI * 2);
      this.context2D.fill();
      this.context2D.restore();
    }
  }

  public strokeLine(x0: number, y0: number, x1: number, y1: number): void {
    if (this.context2D) {
      this.context2D.save();
      this.context2D.beginPath();
      this.context2D.moveTo(x0, y0);
      this.context2D.lineTo(x1, y1);
      this.context2D.stroke();
      this.context2D.restore();
    }
  }

  public strokeCoord(orginX: number, orginY: number, width: number, height: number, lineWidth: number = 3): void {
    if (this.context2D) {
      this.context2D.save();
      this.context2D.lineWidth = lineWidth;
      this.context2D.strokeStyle = 'red';
      this.strokeLine(orginX, orginY, orginX + width, orginY);
      this.context2D.strokeStyle = 'blue';
      this.strokeLine(orginX, orginY, orginX, orginY + height);
      this.context2D.restore();
    }
  }

  public strokeGrid(color: string = 'grey', interval: number = 10): void {
    if (this.context2D) {
      this.context2D.save();
      this.context2D.strokeStyle = color;
      this.context2D.lineWidth = 0.5;
      for (let i: number = interval + 0.5; i < this.canvas.width; i += interval) {
        this.strokeLine(i, 0, i, this.canvas.height);
      }
      for (let i: number = interval + 0.5; i < this.canvas.height; i += interval) {
        this.strokeLine(0, i, this.canvas.width, i);
      }
      this.context2D.restore();
      this.fillCircle(0, 0, 5, 'green');
      this.strokeCoord(0, 0, this.canvas.width, this.canvas.height);
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
