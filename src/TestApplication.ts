import { Canvas2DApplication, CanvasMouseEvent } from "./application";
import { Math2D, Rectangle, Size, vec2 } from "./math2d";

export enum ELayout {
	LEFT_TOP,
	RIGHT_TOP,
	RIGHT_BOTTOM,
	LEFT_BOTTOM,
	CENTER_MIDDLE,
	CENTER_TOP,
	RIGHT_MIDDLE,
	CENTER_BOTTOM,
	LEFT_MIDDLE
}

interface ImageData {
	readonly data: Uint8ClampedArray;
	readonly height: number;
	readonly width: number;
}

type FontStyle = "normal" | "italic" | "oblique";
type FontVariant = "normal" | "small-caps";
type FontWeight =
	"normal"
	| "bold"
	| "bolder"
	| "lighter"
	| "100"
	| "200"
	| "300"
	| "400"
	| "500"
	| "600"
	| "700"
	| "800"
	| "900";
type FontSize =
	"10px"
	| "12px"
	| "16px"
	| "18px"
	| "24px"
	| "50%"
	| "75%"
	| "100%"
	| "125%"
	| "150%"
	| "xx-small"
	| "x-small"
	| "small"
	| "medium"
	| "large"
	| "x-large"
	| "xx-large";
type FontFamily = "sans-serif" | "serif" | "courier" | "fantasy" | "monospace";
type TextAlign = 'start' | 'left' | 'center' | 'right' | 'end';
type TextBaseline = 'alphabetic' | 'hanging' | 'top' | 'middle' | 'bottom';
type FontType = "10px sans-serif" | "15px sans-serif" | "20px sans-serif"
	| "25px sans-serif";
type PatternRepeat = "repeat" | "repeat-x" | "repeat-y" | "no-repeat";

export class TestApplication extends Canvas2DApplication {
	private _lineDashOffset: number = 0;
	private _linearGradient!: CanvasGradient;
	private _radialGradient!: CanvasGradient;
	private _pattern: CanvasPattern | null = null;
	private _mouseX: number = 0;
	private _mouseY: number = 0;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		this.isSupportMouseMove = true;
	}

	public render(): void {
		if (this.context2D) {
			this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.strokeGrid();
			this.drawCanvasCoordCenter();
			// this.doTransform(10, true);
			this.testFillLocalRectWithTitle();
			// console.log('this.mousex', this._mouseX, 'this.mousey', this._mouseY);
			// this.drawCoordInfo(
			// 	'[' + this._mouseX + ', ' + this._mouseY + "]",
			// 	this._mouseX,
			// 	this._mouseY
			// );
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

	public strokeLocalCoord(width: number, height: number, lineWidth: number = 1): void {
		if (this.context2D !== null) {
			this.context2D.save();
			this.context2D.lineWidth = lineWidth;
			this.context2D.strokeStyle = 'red';
			this.strokeLine(0, 0, width, 0);
			this.context2D.strokeStyle = 'blue';
			this.strokeLine(0, 0, 0, height);
			this.context2D.restore();
		}
	}

	public strokeCircle(x: number, y: number, radius: number, color: string = 'red', lineWidth: number = 1): void {
		if (this.context2D !== null) {
			this.context2D.save();
			this.context2D.strokeStyle = color;
			this.context2D.lineWidth = lineWidth;
			this.context2D.beginPath();
			this.context2D.arc(x, y, radius, 0, Math.PI * 2);
			this.context2D.stroke();
			this.context2D.restore();
		}
	}

	public strokeRect(x: number, y: number, w: number, h: number, color: string = 'black'): void {
		if (this.context2D !== null) {
			this.context2D.save();
			this.context2D.strokeStyle = color;
			this.context2D.beginPath();
			this.context2D.moveTo(x, y);
			this.context2D.lineTo(x + w, y);
			this.context2D.lineTo(x + w, y + h);
			this.context2D.lineTo(x, y + h);
			this.context2D.closePath();
			this.context2D.stroke();
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
			// this.strokeCoord(0, 0, this.canvas.width, this.canvas.height);
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
			console.log(" *********LineState********** ");
			console.log(" lineWidth : " + this.context2D.lineWidth);
			console.log(" lineCap : " + this.context2D.lineCap);
			console.log(" lineJoin : " + this.context2D.lineJoin);
			console.log(" miterLimit : " + this.context2D.miterLimit);
		}
	}

	public printTextStates() {
		if (this.context2D) {
			console.log(" *********TextState********** ");
			console.log(" font : " + this.context2D.font);
			console.log(" textAlign : " + this.context2D.textAlign);
			console.log(" textBaseline : " + this.context2D.textBaseline);
		}
	}

	public fillText(text: string, x: number, y: number, color: string = 'white', align: TextAlign = 'left', baseline: TextBaseline = 'top', font: FontType = '10px sans-serif'): void {
		if (this.context2D) {
			this.context2D.save();
			this.context2D.textAlign = align;
			this.context2D.textBaseline = baseline;
			this.context2D.font = font;
			this.context2D.fillStyle = color;
			this.context2D.fillText(text, x, y);
			this.context2D.restore();
		}
	}

	public testCanvas2DTextLayout(): void {
		let x: number = 20;
		let y: number = 20;
		let width: number = this.canvas.width - x * 2;
		let height: number = this.canvas.height - y * 2;
		let drawX: number = x;
		let drawY: number = y;
		let radius: number = 3;
		this.fillRectWithTitle(x, y, width, height);
		this.fillText("left - top", drawX, drawY, 'white', 'left', 'top',
			'10px sans-serif');
		this.fillCircle(drawX, drawY, radius, 'black');

		drawX = x + width;
		drawY = y;
		this.fillText("right - top", drawX, drawY, 'white', 'right',
			'top', '10px sans-serif');
		this.fillCircle(drawX, drawY, radius, 'black');

		drawX = x + width;
		drawY = y + height;
		this.fillText("right - bottom", drawX, drawY, 'white', 'right',
			'bottom', '10px sans-serif');
		this.fillCircle(drawX, drawY, radius, 'black');

		drawX = x;
		drawY = y + height;
		this.fillText("left - bottom", drawX, drawY, 'white', 'left',
			'bottom', '10px sans-serif');
		this.fillCircle(drawX, drawY, radius, 'black');

		drawX = x + width * 0.5;
		drawY = y + height * 0.5;
		this.fillText("center - middle", drawX, drawY, 'black', 'center',
			'middle', '10px sans-serif');
		this.fillCircle(drawX, drawY, radius, 'red');

		drawX = x + width * 0.5;
		drawY = y;
		this.fillText("center - top", drawX, drawY, 'blue', 'center',
			'top', '10px sans-serif');
		this.fillCircle(drawX, drawY, radius, 'black');

		drawX = x + width;
		drawY = y + height * 0.5;
		this.fillText("right - middle", drawX, drawY, 'blue', 'right',
			'middle', '10px sans-serif');
		this.fillCircle(drawX, drawY, radius, 'black');

		drawX = x + width * 0.5;
		drawY = y + height;
		this.fillText("center - bottom", drawX, drawY, 'blue', 'center',
			'bottom', '10px sans-serif');
		this.fillCircle(drawX, drawY, radius, 'black');

		drawX = x;
		drawY = y + height * 0.5;
		this.fillText("left - middle", drawX, drawY, 'blue', 'left',
			'middle', '10px sans-serif');
		this.fillCircle(drawX, drawY, radius, 'black');
	}

	public calcTextSize(text: string, char: string = 'W', scale: number = 0.5): Size {
		if (this.context2D) {
			let size: Size = new Size();
			size.width = this.context2D.measureText(text).width;
			let w: number = this.context2D.measureText(char).width;
			size.height = w + w * scale; // ????????????scale??????
			return size;
		}

		throw new Error(" context2D??????????????????null ");
	}

	public calcLocalTextRectangle(layout: ELayout, text: string, parentWidth: number, parentHeight: number): Rectangle {
		let s: Size = this.calcTextSize(text);
		let o: vec2 = vec2.create();
		let left: number = 0;
		let top: number = 0;
		let right: number = parentWidth - s.width;
		let bottom: number = parentHeight - s.height;
		let center: number = right * 0.5;
		let middle: number = bottom * 0.5;

		switch (layout) {
			case ELayout.LEFT_TOP :
				o.x = left;
				o.y = top;
				break;
			case ELayout.RIGHT_TOP :
				o.x = right;
				o.y = top;
				break;
			case ELayout.RIGHT_BOTTOM :
				o.x = right;
				o.y = bottom;
				break;
			case ELayout.LEFT_BOTTOM :
				o.x = left;
				o.y = bottom;
				break;
			case ELayout.CENTER_MIDDLE:
				o.x = center;
				o.y = middle;
				break;
			case ELayout.CENTER_TOP :
				o.x = center;
				o.y = 0;
				break;
			case ELayout.RIGHT_MIDDLE :
				o.x = right;
				o.y = middle;
				break;
			case ELayout.CENTER_BOTTOM:
				o.x = center;
				o.y = bottom;
				break;
			case ELayout.LEFT_MIDDLE :
				o.x = left;
				o.y = middle;
				break;
		}
		// ???????????????
		return new Rectangle(o, s);
	}

	public fillRectWithTitle(x: number, y: number, width: number, height:
		number, title: string = '', layout: ELayout = ELayout.CENTER_MIDDLE, color: string = 'grey', showCoord: boolean = true) {
		if (this.context2D) {
			this.context2D.save();
			// 1. ????????????
			this.context2D.fillStyle = color;
			this.context2D.beginPath();
			this.context2D.rect(x, y, width, height);
			this.context2D.fill();
			// ????????????????????????????????????????????????x???y??????
			if (title.length) {
				// 2. ??????????????????
				// ???????????????????????????????????????????????????????????????10px???????????????
				// ??????calcLocalTextRectangle??????
				let rect: Rectangle = this.calcLocalTextRectangle(layout,
					title, width, height);
				// ????????????
				this.fillText(title, x + rect.origin.x, y + rect.origin.y, 'white', 'left', 'top', '10px sans-serif');
				// ???????????????
				this.strokeRect(x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba( 0 , 0 ,0 , 0.5)');
				// ?????????????????????????????????????????????????????????
				this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2);
			}
			// 3. ??????????????????????????????
			// ?????????????????????x??????y???????????????width???height???20?????????
			// ????????????3??????????????????
			if (showCoord) {
				this.strokeCoord(x, y, width + 20, height + 20);
				this.fillCircle(x, y, 3);
			}
			this.context2D.restore();
		}
	}


	public makeFontString(
		size: FontSize = '10px',
		weight: FontWeight = 'normal',
		style: FontStyle = 'normal',
		variant: FontVariant = 'normal',
		family: FontFamily = 'sans-serif',
	): string {
		let strs: string [ ] = [];
		// don't change order
		strs.push(style);
		strs.push(variant);
		strs.push(weight);
		strs.push(size);
		strs.push(family);

		return strs.join(" ");
	}

	public drawImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement |
		ImageBitmap, dstX: number, dstY: number) {

	}

	public drawImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement |
		ImageBitmap, dstX: number, dstY: number, dstW: number, dstH: number) {

	}

	public drawImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement |
		ImageBitmap, srcX: number, srcY: number, srcW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number) {

	}

	public loadAndDrawImage(url: string): void {
		let img: HTMLImageElement = document.createElement('img') as HTMLImageElement;
		img.src = url;
		img.onload = (ev: Event): void => {
			if (this.context2D) {
				console.log(url + " ????????? [ " + img.width + " , " + img.height + " ] ");
				this.context2D.drawImage(img, 10, 10);
				// ???srcImage?????????????????????????????????Canvas????????????????????????
				this.context2D.drawImage(img, img.width + 30, 10, 200, img.height);
				// ???srcImage???????????????[ 44 , 6 , 162 , 175 , 200 ]?????????????????????????????????Canvas
				// ?????????????????????[ 200 , img . height + 30 , 200 , 130 ]???
				this.context2D.drawImage(img, 44, 6, 162, 175, 200, img.height
					+ 30, 200, 130);
			}
		}
	}

	public drawImage(img: HTMLImageElement, destRect: Rectangle, srcRect:
		Rectangle = Rectangle.create(0, 0, img.width, img.height), fillType:
		                 EImageFillType = EImageFillType.STRETCH): boolean {
		// ??????image?????????????????????
		if (this.context2D === null) {
			return false;
		}
		if (srcRect.isEmpty()) {
			return false;
		}
		if (destRect.isEmpty()) {
			return false;
		}
		// ??????stretch???repeat????????????
		if (fillType === EImageFillType.STRETCH) {
			this.context2D.drawImage(img,
				srcRect.origin.x,
				srcRect.origin.y,
				srcRect.size.width,
				srcRect.size.height,
				destRect.origin.x,
				destRect.origin.y,
				destRect.size.width,
				destRect.size.height
			);
		} else {
			this.fillRectangleWithColor(destRect, 'grey');
			let rows: number = Math.ceil(destRect.size.width / srcRect.size.width);
			let colums: number = Math.ceil(destRect.size.height / srcRect.size.height);
			let left: number = 0;
			let top: number = 0;
			let right: number = 0;
			let bottom: number = 0;
			let width: number = 0;
			let height: number = 0;
			let destRight: number = destRect.origin.x + destRect.size.width;
			let destBottom: number = destRect.origin.y + destRect.size.height;
			if (fillType === EImageFillType.REPEAT_X) {
				colums = 1;
			} else if (fillType === EImageFillType.REPEAT_Y) {
				rows = 1;
			}
			for (let i: number = 0; i < rows; i++) {
				for (let j: number = 0; j < colums; j++) {
					// ???????????????i??????j????????????
					left = destRect.origin.x + i * srcRect.size.width;
					top = destRect.origin.y + j * srcRect.size.height;
					width = srcRect.size.width;
					height = srcRect.size.height;

					right = left + width;
					bottom = top + height;
					if (right > destRight) {
						width = srcRect.size.width - (right - destRight);
					}
					if (bottom > destBottom) {
						height = srcRect.size.height - (bottom - destBottom);
					}

					this.context2D.drawImage(img,
						srcRect.origin.x,
						srcRect.origin.y,
						width,
						height,
						left, top, width, height
					);
				}
			}
		}
		return true;
	}

	public printShadowStates(): void {
		if (this.context2D) {
			console.log(" ********* ShadowState ********** ");
			console.log(" shadowBlur : " + this.context2D.shadowBlur);
			console.log(" shadowColor : " + this.context2D.shadowColor);
			console.log(" shadowOffsetX : " + this.context2D.shadowOffsetX);
			console.log(" shadowOffsetY : " + this.context2D.shadowOffsetY);
		}
	}

	public setShadowState(
		shadowBlur: number = 5,
		shadowColor: string = "rgba( 127 , 127 , 127 , 0.5 )",
		shadowOffsetX: number = 10,
		shadowOffsetY: number = 10) {
		if (this.context2D) {
			this.context2D.shadowBlur = shadowBlur;
			this.context2D.shadowColor = shadowColor;
			this.context2D.shadowOffsetX = shadowOffsetX;
			this.context2D.shadowOffsetY = shadowOffsetY;
		}
	}

	public drawCanvasCoordCenter(): void {
		if (!this.context2D) return;

		let halfWidth: number = this.canvas.width * 0.5;
		let halfHeight: number = this.canvas.height * 0.5;
		this.context2D.save();
		this.context2D.lineWidth = 2;
		this.context2D.strokeStyle = 'rgba( 255 , 0 , 0 , 0.5 ) ';
		this.strokeLine(0, halfHeight, this.canvas.width, halfHeight);
		this.context2D.strokeStyle = 'rgba( 0 , 0 , 255 , 0.5 )';
		this.strokeLine(halfWidth, 0, halfWidth, this.canvas.height);
		this.context2D.restore();
		this.fillCircle(halfWidth, halfHeight, 5, 'rgba(0 , 0 , 0 , 0.5 ) ');
	}

	// ???????????????????????????????????????????????????
	public drawCoordInfo(info: string, x: number, y: number): void {
		this.fillText(info, x, y, 'black', 'center', 'bottom');
	}

	// ?????????????????????
	public distance(x0: number, y0: number, x1: number, y1: number):
		number {
		let diffX: number = x1 - x0;
		let diffY: number = y1 - y0;
		return Math.sqrt(diffX * diffX + diffY * diffY);
	}

	protected dispatchMouseMove(evt: CanvasMouseEvent): void {
		this._mouseX = evt.canvasPosition.x;
		this._mouseY = evt.canvasPosition.y;
	}

	// rotateFirst????????????????????????????????????
	public doTransform(degree: number, rotateFirst: boolean = true): void {
		if (this.context2D) {
			// ??????????????????????????????????????????
			// ??????????????????????????????????????????????????????
			let radius: number = this.distance(0, 0, this.canvas.width * 0.5, this.canvas.height * 0.5);
			// ?????????????????????
			this.strokeCircle(0, 0, radius, 'black');

			let radians: number = Math2D.toRadian(degree);

			// ?????????
			this.context2D.save();
			if (rotateFirst) {
				this.context2D.rotate(radians);
				this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)
			} else {
				this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)
				this.context2D.rotate(radians);
			}
			this.fillRectWithTitle(0, 0, 100, 60, '+' + degree +
				'?????????');
			this.context2D.restore();

			// ?????????
			this.context2D.save();
			if (rotateFirst) {
				this.context2D.rotate(-radians);
				this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)
			} else {
				this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)
				this.context2D.rotate(-radians);
			}
			this.fillRectWithTitle(0, 0, 100, 60, '-' + degree + '?????????');
			this.context2D.restore()
		}
	}

	public fillLocalRectWithTitle(
		width: number,   //????????????????????????
		height: number,                             //????????????????????????
		title: string = '',                        //???????????????????????????
		referencePt: ELayout = ELayout.CENTER_MIDDLE,
		//????????????????????????????????????
		layout: ELayout = ELayout.CENTER_MIDDLE,
		//??????????????????????????????????????????
		color: string = 'grey',                   //??????????????????????????????
		showCoord: boolean = true
		//????????????????????????????????????????????????????????????
	): void {
		if (this.context2D) {
			let x: number = 0;
			let y: number = 0;
			// ????????????referencePt?????????????????????????????????????????????
			// Canvas2D?????????????????????????????????????????????????????????????????????????????????????????????
			switch (referencePt) {
				case ELayout.LEFT_TOP :      //Canvas2D??????????????????????????????????????????
					x = 0;
					y = 0;
					break;
				case ELayout.LEFT_MIDDLE:                //???????????????
					x = 0;
					y = -height * 0.5;
					break;
				case ELayout.LEFT_BOTTOM :               //???????????????
					x = 0;
					y = -height;
					break;
				case ELayout.RIGHT_TOP :                  //???????????????
					x = -width;
					y = 0;
					break;
				case ELayout.RIGHT_MIDDLE:               //???????????????
					x = -width;
					y = -height * 0.5;
					break;
				case ELayout.RIGHT_BOTTOM :               //???????????????
					x = -width;
					y = -height;
					break;
				case ELayout.CENTER_TOP :                //???????????????
					x = -width * 0.5;
					y = 0;
					break;
				case ELayout.CENTER_MIDDLE :              //???????????????
					x = -width * 0.5;
					y = -height * 0.5;
					break;
				case ELayout.CENTER_BOTTOM :             //???????????????
					x = -width * 0.5;
					y = -height;
					break;
			}
			// ????????????????????????????????????fillRectWithTitle??????
			this.context2D.save();
			// 1. ????????????
			this.context2D.fillStyle = color;
			this.context2D.beginPath();
			this.context2D.rect(x, y, width, height);
			this.context2D.fill();
			// ??????????????????????????????????????????x, y??????
			if (title.length !== 0) {
				// 2. ??????????????????
				// ???????????????????????????????????????????????????????????????10px???????????????
				let rect: Rectangle = this.calcLocalTextRectangle(layout,
					title, width, height);
				// ????????????
				this.fillText(title, x + rect.origin.x, y + rect.origin.y, 'white', 'left', 'top' /*, '10px sans-serif'*/);
				// ???????????????
				this.strokeRect(x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba( 0 , 0 ,0 , 0.5)');
				// ?????????????????????????????????????????????????????????
				this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2);
			}
			// 3. ????????????????????????????????????????????????????????????[ 0 , 0 ]
			// ?????????????????????x??????y???????????????width???height???20??????
			// ????????????3???????????????
			if (showCoord) {
				this.strokeCoord(0, 0, width + 20, height + 20);
				this.fillCircle(0, 0, 3);
			}
			this.context2D.restore();
		}
	}


	// ???doTransform???????????????????????????????????????????????????rotateTranslate??????
	public rotateTranslate(degree: number, layout: ELayout = ELayout.LEFT_TOP, width: number = 40, height: number = 20): void {
		if (!this.context2D) return;
		let radians: number = Math2D.toRadian(degree);
		this.context2D.save();
		this.context2D.rotate(radians);
		this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5);
		this.fillLocalRectWithTitle(width, height, '', layout);
		this.context2D.restore();
	}

	// ??????testFillLocalRectWitTitle????????????????????????????????????????????????9?????????????????????
	public testFillLocalRectWithTitle(): void {
		if (this.context2D) {
			// ??????0????????????????????????????????????????????
			this.rotateTranslate(0, ELayout.LEFT_TOP);
			// ????????????????????????4????????????ELayout???
			this.rotateTranslate(10, ELayout.LEFT_MIDDLE);
			this.rotateTranslate(20, ELayout.LEFT_BOTTOM);
			this.rotateTranslate(30, ELayout.CENTER_TOP);
			this.rotateTranslate(40, ELayout.CENTER_MIDDLE);
			// ????????????????????????4????????????ELayout???
			this.rotateTranslate(-10, ELayout.CENTER_BOTTOM);
			this.rotateTranslate(-20, ELayout.RIGHT_TOP);
			this.rotateTranslate(-30, ELayout.RIGHT_MIDDLE);
			this.rotateTranslate(-40, ELayout.RIGHT_BOTTOM);
			// ????????????
			let radius: number = this.distance(0, 0, this.canvas.width * 0.5, this.canvas.height * 0.5);
			// ?????????????????????
			this.strokeCircle(0, 0, radius, 'black');
		}
	}
}
