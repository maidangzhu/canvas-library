import {useEffect} from "react";
import {ApplicationTest} from "./applicationTest";
import {Application} from "./application";
import "./applicationTest.less";

function Test() {
  useEffect(() => {
    let canvas: HTMLCanvasElement | null = document.getElementById("canvas") as HTMLCanvasElement
    let app: Application = new ApplicationTest(canvas)
    app.update(0, 0)
    app.render()

    let startBtn = document.getElementById("start") as HTMLButtonElement
    let stopBtn = document.getElementById("stop") as HTMLButtonElement
    startBtn.onclick = () => {
      app.start();
    };
    stopBtn.onclick = () => {
      app.stop();
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
