import {vec2} from "./math2d" ;

export type TimerCallback = (id: number, data: any) => void;

class Timer {
  public id: number = -1;
  public enabled: boolean = false;

  public callback: TimerCallback;
  public callbackData: any = undefined;

  public countdown: number = 0;
  public timeout: number = 0;
  public onlyOnce: boolean = false;

  constructor(callback: TimerCallback) {
    this.callback = callback;
  }
}

interface EventListenerObject {
  handleEvent(evt: Event): void;
}

export class Application implements EventListenerObject {
  public timers: Timer[] = [];
  private _timerId: number = -1;
  private _fps: number = 0;
  protected _start: boolean = false;
  protected _requestId: number = -1;
  protected _lastTIme!: number;
  protected _startTime!: number;
  public isSupportMouseMove: boolean;
  protected canvas: HTMLCanvasElement;
  protected _isMouseDown: boolean;

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.addEventListener('mousedown', this, false);
    this.canvas.addEventListener('mouseup', this, false);
    this.canvas.addEventListener('mousemove', this, false);

    window.addEventListener('keydown', this, false);
    window.addEventListener('keyup', this, false);
    window.addEventListener('keypress', this, false);

    this._isMouseDown = false;
    this.isSupportMouseMove = false;
  }


  public handleEvent(evt: Event): void {
    switch (evt.type) {
      case'mousedown':
        this._isMouseDown = true;
        this.dispatchMouseDown(this._toCanvasMouseEvent(evt));
        break;
      case'mousemove':
        if (this.isSupportMouseMove) {
          this.dispatchMouseMove(this._toCanvasMouseEvent(evt));
        }
        if (this._isMouseDown) {
          this.dispatchMouseDrag(this._toCanvasMouseEvent(evt));
        }
        break;
      case "mouseup":
        this._isMouseDown = false;
        this.dispatchMouseUp(this._toCanvasMouseEvent(evt));
        break;
      case "keypress":
        this.dispatchKeyPress(this._toCanvasKeyboardEvent(evt));
        break;
      case "keydown":
        this.dispatchKeyDown(this._toCanvasKeyboardEvent(evt));
        break;
      case "keyup":
        this.dispatchKeyUp(this._toCanvasKeyboardEvent(evt));
        break;
    }
  }

  protected dispatchMouseDown(evt: CanvasMouseEvent): any {
  }

  protected dispatchMouseMove(evt: CanvasMouseEvent): any {
  }

  protected dispatchMouseUp(evt: CanvasMouseEvent): any {
  }

  protected dispatchMouseDrag(evt: CanvasMouseEvent): any {
  }

  protected dispatchKeyPress(evt: CanvasKeyboardEvent): any {
  }

  protected dispatchKeyDown(evt: CanvasKeyboardEvent): any {
  }

  protected dispatchKeyUp(evt: CanvasKeyboardEvent): any {
  }

  public start() {
    if (!this._start) {
      this._start = true;
      this._startTime = -1;
      this._lastTIme = -1;
      this._requestId = window.requestAnimationFrame(this.step.bind(this));
    }
  }

  public stop() {
    if (this._start) {
      window.cancelAnimationFrame(this._requestId);
      this._start = false;
      this._requestId = -1;
      this._startTime = -1;
      this._lastTIme = -1;
    }
  }

  public isRunning(): boolean {
    return this._start;
  }

  public get fps() {
    return this._fps;
  }

  protected step(timeStamp: number) {
    if (this._startTime === -1) this._startTime = timeStamp;
    if (this._lastTIme === -1) this._lastTIme = timeStamp;

    let elapsedMsec: number = timeStamp - this._startTime;
    let intervalSec: number = timeStamp - this._lastTIme;

    if (intervalSec !== 0) {
      this._fps = 1000.0 / intervalSec;
    }

    intervalSec /= 1000.0;
    this._lastTIme = timeStamp;
    this._handleTimers(intervalSec);
    this.update(elapsedMsec, intervalSec);
    this.render()

    requestAnimationFrame((elapsedMsec: number): void => {
      this.step(elapsedMsec);
    });
  }

  public update(elapsedMsec: number, intervalSec: number) {
  }

  public render() {
  }

  private _viewportToCanvasCoordinate(evt: MouseEvent): vec2 {
    if (this.canvas) {
      let rect: ClientRect = this.canvas.getBoundingClientRect();

      if (evt.target) {
        let borderLeftWidth: number = 0;
        let borderTopWidth: number = 0;
        let paddingLeft: number = 0;
        let paddingTop: number = 0;
        let decl: CSSStyleDeclaration = window.getComputedStyle(evt.target as HTMLElement);
        let strNumber: string | null = decl.borderLeftWidth;

        if (strNumber !== null) {
          borderLeftWidth = parseInt(strNumber, 10);
        }

        if (strNumber !== null) {
          borderTopWidth = parseInt(strNumber, 10);
        }

        strNumber = decl.paddingLeft;
        if (strNumber !== null) {
          paddingLeft = parseInt(strNumber, 10);
        }

        strNumber = decl.paddingTop;
        if (strNumber !== null) {
          paddingTop = parseInt(strNumber, 10);
        }

        let x: number = evt.clientX - rect.left - borderLeftWidth - paddingLeft;
        let y: number = evt.clientY - rect.top - borderTopWidth - paddingTop;

        let pos: vec2 = vec2.create(x, y);

        return pos;
      }

      throw new Error("canvas为null");
    }

    throw new Error("evt . target为null");
  }

  private _toCanvasMouseEvent(evt: Event): CanvasMouseEvent {
    let event: MouseEvent = evt as MouseEvent;
    let mousePosition: vec2 = this._viewportToCanvasCoordinate(event);
    return new CanvasMouseEvent(mousePosition, event.button, event.altKey, event.ctrlKey, event.metaKey, event.shiftKey);
  }

  private _toCanvasKeyboardEvent(evt: Event): CanvasKeyboardEvent {
    let event: KeyboardEvent = evt as KeyboardEvent;
    return new CanvasKeyboardEvent(event.key, event.keyCode, event.repeat, event.altKey, event.ctrlKey, event.metaKey, event.shiftKey);
  }

  public addTimer(callback: TimerCallback, timeout: number = 1.0, onlyOnce: boolean = false, data: any = undefined): number {
    let timer: Timer
    let found: boolean = false;
    for (let i = 0; i < this.timers.length; i++) {
      let timer: Timer = this.timers [i];
      if (!timer.enabled) {
        timer.callback = callback;
        timer.callbackData = data;
        timer.timeout = timeout;
        timer.countdown = timeout;
        timer.enabled = true;
        timer.onlyOnce = onlyOnce;
        return timer.id;
      }
    }

    timer = new Timer(callback);
    timer.callbackData = data;
    timer.timeout = timeout;
    timer.countdown = timeout;
    timer.enabled = true;
    timer.id = ++this._timerId;
    timer.onlyOnce = onlyOnce;

    this.timers.push(timer);
    return timer.id;
  }

  public removeTimer(id: number): boolean {
    let found: boolean = false;
    for (let i = 0; i < this.timers.length; i++) {
      if (this.timers [i].id === id) {
        let timer: Timer = this.timers [i];
        timer.enabled = false;
        found = true;
        break;
      }
    }
    return found;
  }

  private _handleTimers(intervalSec: number): void {
    for (let i = 0; i < this.timers.length; i++) {
      let timer: Timer = this.timers [i];
      if (!timer.enabled) {
        continue;
      }
      timer.countdown -= intervalSec;
      if (timer.countdown < 0.0) {
        timer.callback(timer.id, timer.callbackData);
        if (!timer.onlyOnce) {
          timer.countdown = timer.timeout;
        } else {
          this.removeTimer(timer.id);
        }
      }
    }
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

export class Canvas2DApplication extends Application {
  public context2D: CanvasRenderingContext2D | null;

  public constructor(canvas: HTMLCanvasElement, contextAttributes?: CanvasRenderingContext2D) {
    super(canvas);
    this.context2D = this.canvas.getContext('2d', contextAttributes) as CanvasRenderingContext2D;
  }
}

export class WebGLApplication extends Application {
  public context3D: WebGLRenderingContext | null;

  public constructor(canvas: HTMLCanvasElement, contextAttributes?: WebGLRenderingContext) {
    super(canvas);
    this.context3D = this.canvas.getContext('webgl', contextAttributes) as WebGLRenderingContext;
    if (!this.context3D) {
      this.context3D = this.canvas.getContext("experimental-webgl", contextAttributes) as WebGLRenderingContext;

      if (!this.context3D) {
        throw new Error("Could not create WebGL context");
      }
    }
  }
}
