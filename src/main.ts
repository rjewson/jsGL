// import {draw} from "./lessons/Lesson-1";
// import {draw} from "./lessons/Lesson-2";
// import { draw } from "./lessons/Lesson-3";
// import {draw} from "./lessons/Lesson-4";
import {draw} from "./lessons/Lesson-5";
import "./styles.css";

const canvas: HTMLCanvasElement = document.getElementById("output") as HTMLCanvasElement;
canvas.width = 300;
canvas.height = 300;
const screenCtx = canvas.getContext("2d");

draw(screenCtx);
