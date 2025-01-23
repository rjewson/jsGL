import { lesson1_1 } from "./lessons/Lesson-1-1";
import { lesson1_2 } from "./lessons/Lesson-1-2";
import { lesson1_3 } from "./lessons/Lesson-1-3";
import { lesson2 } from "./lessons/Lesson-2";
import { lesson3_1 } from "./lessons/Lesson-3-1";
import { lesson3_2 } from "./lessons/Lesson-3-2";
import { lesson5_1 } from "./lessons/Lesson-5-1";
import { lesson5_2 } from "./lessons/Lesson-5-2";
import { lesson5_3 } from "./lessons/Lesson-5-3";
import { lesson5_4 } from "./lessons/Lesson-5-4";
import { FrameBuffer } from "./lib/FrameBuffer";

import "./styles.css";

const canvas: HTMLCanvasElement = document.getElementById("output") as HTMLCanvasElement;
canvas.width = 300;
canvas.height = 300;
const screenCtx = canvas.getContext("2d");

const frameBuffer: FrameBuffer = new FrameBuffer(canvas.width, canvas.height);

const lessons = {
    "1-1": lesson1_1,
    "1-2": lesson1_2,
    "1-3": lesson1_3,
    "2-1": lesson2,
    "3-1": lesson3_1,
    "3-2": lesson3_2,
    "5-1": lesson5_1,
    "5-2": lesson5_2,
    "5-3": lesson5_3,
    "5-4": lesson5_4,
};

//Common update loop
let time = 0;
export const updateFunctions = [];
function tick() {
    updateFunctions.forEach(fn => fn(time++));
    requestAnimationFrame(tick);
}
tick();

// Make UI
const linkContainer = document.getElementById("links");
for (const key of Object.keys(lessons)) {
    const link = document.createElement('a');
    link.href = "#" + key;
    link.textContent = "Lesson " + key;
    linkContainer.appendChild(link);
}

// Navigate on UI
function locationHashChanged() {
    const urlLesson = location.hash.substring(1);
    if (lessons.hasOwnProperty(urlLesson)) {
        console.clear();
        console.log("Lesson " + urlLesson);
        updateFunctions.length = 0;
        frameBuffer.clear();
        lessons[urlLesson](screenCtx, frameBuffer);
    } else {
        window.location.hash = "1-1";
    }
}

window.onhashchange = locationHashChanged;
locationHashChanged();
