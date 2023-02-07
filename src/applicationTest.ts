import { Application, CanvasKeyboardEvent, CanvasMouseEvent } from "./application";

export class ApplicationTest extends Application {
	protected dispatchMouseDown(evt: CanvasMouseEvent) {
		console.log('canvasPosition: ', evt.canvasPosition);
	}

	protected dispatchKeyDown(evt: CanvasKeyboardEvent): any {
		console.log('key: ', evt.key + ' is down');
	}

	public update(elapsedMsec: number, intervalMsec: number) {
		console.log('elapsedMsec: ', elapsedMsec, 'intervalMsec: ', intervalMsec);
	}

	public render() {
		console.log('render');
	}
}
