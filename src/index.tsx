import {useEffect} from "react";
import {Application} from "./application";
import "./applicationTest.less";

function Test() {
  useEffect(() => {
    function timerCallback(id: number, data: string): void {
      console.log("当前调用的Timer的id : " + id + " data : " + data);
    }

    let canvas: HTMLCanvasElement | null = document.getElementById("canvas") as HTMLCanvasElement
    let app: Application = new Application(canvas)
    let timer0: number = app.addTimer(timerCallback, 5, false, " data是timeCallback的数据 ");
    let timer1: number = app.addTimer(timerCallback, 5, true, " data是timeCallback的数据 ");

    app.update(0, 0)
    app.render()

    let startBtn = document.getElementById("start") as HTMLButtonElement
    let stopBtn = document.getElementById("stop") as HTMLButtonElement
    startBtn.onclick = () => {
      app.start();
    };
    stopBtn.onclick = () => {
      app.stop();
      app.removeTimer(timer0);
      app.removeTimer(timer1);
      console.log(app.timers.length);
      let id: number = app.addTimer(timerCallback, 10, true, " data是timeCallback的数据 ");
      console.log(id === 0);
    }
  }, []);

  return (
    <div>
      <button id="start">start</button>
      <button id="stop">stop</button>
      <br/>
      <canvas id="canvas"/>
    </div>
  )
}

export default Test;
