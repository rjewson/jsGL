import { lesson1_1 } from "./lessons/Lesson-1-1";
import { lesson1_2 } from "./lessons/Lesson-1-2";
import { lesson1_3 } from "./lessons/Lesson-1-3";
import { lesson2_1 } from "./lessons/Lesson-2-1";
import { lesson2_2 } from "./lessons/Lesson-2-2";
import { lesson3_1 } from "./lessons/Lesson-3-1";
import { lesson3_2 } from "./lessons/Lesson-3-2";
import { lesson5_1 } from "./lessons/Lesson-5-1";
import { lesson5_2 } from "./lessons/Lesson-5-2";
import { lesson5_3 } from "./lessons/Lesson-5-3";
import { lesson5_4 } from "./lessons/Lesson-5-4";
import { lesson5_5 } from "./lessons/Lesson-5-5";
import { lesson5_6 } from "./lessons/Lesson-5-6";
import { DrawingBuffer } from "./lib/DrawingBuffer";

import "./styles.css";
import { disposePane } from "./utils/Options";
import { clearOnTick } from "./utils/Ticker";

const canvas: HTMLCanvasElement = document.getElementById("output") as HTMLCanvasElement;
canvas.width = 300;
canvas.height = 250;
const screenCtx = canvas.getContext("2d");

const drawingBuffer: DrawingBuffer = new DrawingBuffer(canvas.width, canvas.height);

const lessons: { [key: string]: (screenCtx: CanvasRenderingContext2D, fb: DrawingBuffer) => Promise<void> } = {
    "1-1": lesson1_1,
    "1-2": lesson1_2,
    "1-3": lesson1_3,
    "2-1": lesson2_1,
    "2-2": lesson2_2,
    "3-1": lesson3_1,
    "3-2": lesson3_2,
    "5-1": lesson5_1,
    "5-2": lesson5_2,
    "5-3": lesson5_3,
    "5-4": lesson5_4,
    "5-5": lesson5_5,
    "5-6": lesson5_6,
};

// Make UI
const linkContainer = document.getElementById("links");
for (const key of Object.keys(lessons)) {
    const link = document.createElement('a');
    link.id = key;
    link.href = "#" + key;
    link.textContent = "L " + key;
    linkContainer.appendChild(link);
}

// Navigate on UI
function locationHashChanged() {
    const urlLesson = location.hash.substring(1);
    if (lessons.hasOwnProperty(urlLesson)) {
        console.clear();
        console.log("Lesson " + urlLesson);
        clearOnTick();
        drawingBuffer.clear();
        disposePane();

        (lessons[urlLesson as keyof typeof lessons])(screenCtx, drawingBuffer);
    } else {
        window.location.hash = "1-1";
    } 
}

window.onhashchange = locationHashChanged;

locationHashChanged();
