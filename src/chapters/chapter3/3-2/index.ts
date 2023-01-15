export class Application {
  protected _start: boolean = false;
  protected _requestId: number = -1;
  protected _lastTIme!: number;
  protected _startTime!: number;

  public start() {
    if (!this._start) {
      this._start = true;
      this._requestId = -1;
      this._startTime = -1;
      this._lastTIme = -1;
      this._requestId = requestAnimationFrame(this.step.bind(this));
    }
  }

  public stop() {
    if (this._start) {
      cancelAnimationFrame(this._requestId);
      this._start = false;
      this._requestId = -1;
      this._startTime = -1;
      this._lastTIme = -1;
    }
  }

  public isRunning(): boolean {
    return this._start;
  }

  protected step(timeStamp: number) {
    if (this._startTime === -1) this._startTime = timeStamp;
    if (this._lastTIme === -1) this._lastTIme = timeStamp;

    let elapsedMsec: number = timeStamp - this._startTime;
    let intervalMsec: number = timeStamp - this._lastTIme;

    this._lastTIme = timeStamp;

    this.update(elapsedMsec, intervalMsec);
    this.render()

    window.requestAnimationFrame(this.step.bind(this));
  }

  public update(elapsedMsec: number, intervalMsec: number) {
  }

  public render() {
  }

  private _viewportToCanvasCoordinate(evt: MouseEvent): vec2 {
    if (this.canvas) {
      let rect: ClientRect = this.canvas.getBoundingClientRect();

      const x: number = evt.clientX - rect.left;
      const y: number = evt.clientY - rect.top;

      return vec2.create(x, y);
    }

    throw new Error("canvas is null");
  }

  private _toCanvasMouseEvent(evt: Event): CanvasMouseEvent {
    let event: MouseEvent = evt as MouseEvent;
    let mousePosition: vec2 = this._viewportToCanvasCoordinate(event);
    return new CanvasMouseEvent(mousePosition, event.altKey, event.ctrlKey, event.shiftKey, event.metaKey, event.shiftKey);
  }

  private _toCanvasKeyboardEvent(evt: Event): CanvasKeyboardEvent {
    let event: KeyboardEvent = evt as KeyboardEvent;
    return new CanvasKeyboardEvent(event.key, event.keyCode, event.repeat, event.altKey, event.ctrlKey, event.shiftKey, event.metaKey, event.shiftKey);
  }
}

export enum EInputEventType {
  MOUSEEVENT,
  MOUSEDOWN,
  MOUSEUP,
  MOUSEMOVE,
  MOUSEDRAG,
  KEYBOARDEVENT,
  KEYUP,
  KEYDOWN,
  KEYPRESS
}

export class CanvasInputEvent {
  public altKey: boolean;
  public ctrlKey: boolean;
  public metaKey: boolean;
  public shiftKey: boolean;

  public type: EInputEventType;

  public constructor(altKey: boolean = false, ctrlKey: boolean = false, metaKey: boolean = false, shiftKey: boolean = false, type: EInputEventType = EInputEventType.MOUSEEVENT) {
    this.altKey = altKey;
    this.ctrlKey = ctrlKey;
    this.metaKey = metaKey;
    this.shiftKey = shiftKey;
    this.type = type;
  }
}

export class CanvasMouseEvent extends CanvasInputEvent {
  public button: number; // 0 1 2
  public canvasPosition: vec2;
  public localPosition: vec2;
  public constructor(canvasPos: vec2, button: number, altKey: boolean = false, ctrlKey: boolean = false, metaKey: boolean = false, shiftKey: boolean = false) {
    super(altKey, ctrlKey, metaKey, shiftKey);
    this.canvasPosition = canvasPos;
    this.button = button;
    this.localPosition = vec2.create();
  }
}

export class CanvasKeyboardEvent extends CanvasInputEvent {
  public key: string;
  public keyCode: number;
  public repeat: boolean;
  public constructor(key: string, keyCode: number, repeat: boolean, altKey: boolean = false, ctrlKey: boolean = false, metaKey: boolean = false, shiftKey: boolean = false) {
    super(altKey, ctrlKey, metaKey, shiftKey);
    this.key = key;
    this.keyCode = keyCode;
    this.repeat = repeat;
  }
}
