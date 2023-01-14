let start: number = 0;
let lastTime: number= 0;
let count: number = 0;

export function step(timestamp: number): void {
  if (!start) start = timestamp;
  if (!lastTime) lastTime = timestamp;

  let elapsedMsec: number = timestamp - start;
  let intervalMsec: number = timestamp - lastTime;

  lastTime = timestamp;

  count++;
  console.log(count, 'timestamp', timestamp, 'ms');
  console.log(count, 'elapsed', elapsedMsec, 'ms');
  console.log(count, 'interval', intervalMsec,'ms');
  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
