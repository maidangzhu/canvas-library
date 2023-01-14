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

  public update (elapsedMsec: number, intervalMsec: number) {}

  public render () {}
}
