import { Point } from "./Types";

export class Clip {

    clipTL: Point;
    clipBR: Point;

    constructor(x: number, y: number, width: number, height: number) {
        this.set(x, y, width, height);
    }

    set(x: number, y: number, width: number, height: number) {
        this.clipTL = [x, y];
        this.clipBR = [x + width - 1, y + height - 1];
    }

}