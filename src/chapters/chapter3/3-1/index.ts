// @ts-ignore
let posX: number = 0;
let speedX: number = 10;
let start: number = 0;
let lastTime: number= 0;

function update(timestamp: number, elapsedMsec: number, intervalMsec: number) {
  let t = intervalMsec / 1000;

  posX += speedX * t;
  console.log('current poxX: ' + posX);
}

function render(ctx: CanvasRenderingContext2D | null) {
  console.log('render');
}

export function step(timestamp: number): void {
  if (!start) start = timestamp;
  if (!lastTime) lastTime = timestamp;

  let elapsedMsec: number = timestamp - start;
  let intervalMsec: number = timestamp - lastTime;

  lastTime = timestamp;

  update(timestamp, elapsedMsec, intervalMsec);
  render(null);
  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
