import { Clip } from "./Clip";
import { Colour, Point } from "./Types";

export enum BlendMode {
    Over,
    Normal,
    Add,
}

export type BlendFn = (data: Uint8ClampedArray, colour: Colour, index: number) => void;

export class DrawingBuffer extends ImageData {

    public clip: Clip;
    private defaultClip: Clip;
    private blend: BlendMode;
    private blendFn: BlendFn;

    //Faster than using base class width and height
    private _width: number;
    private _height: number;

    constructor(width: number, height: number) {
        super(width, height);
        this._width = width;
        this._height = height;
        this.defaultClip = new Clip(0, 0, width, height);
        this.setClip(this.defaultClip);
        this.blendMode(BlendMode.Normal);

    }

    set(x: number, y: number, colour: Colour): void {
        // if alpha is 0, don't draw
        if (colour[3] === 0) {
            return;
        }
        const index = 4 * (x + y * this._width);
        this.blendFn(this.data, colour, index);
        this.data.set(colour, index);

    }

    write(outputCtx: CanvasRenderingContext2D): void {
        outputCtx.putImageData(this, 0, 0);
    }

    clear(): void {
        this.data.fill(0);
    }

    blendMode(mode: BlendMode): void {
        if (mode != this.blend) {
            console.log("Blending set to " + BlendMode[mode]);
            this.blend = mode;
            this.blendFn = blendFunctions[mode];
        }
    }

    setClip(clip: Clip) {
        this.clip = clip;
    }

    clearClip() {
        this.clip = this.defaultClip;
    }

}

const blendFunctions = {
    [BlendMode.Over]: blendOver,
    [BlendMode.Normal]: blendNormal,
    [BlendMode.Add]: blendAdd,
}

function blendOver(data: Uint8ClampedArray, colour: Colour, index: number) {
    // Leave the source colour as is
}

function blendNormal(data: Uint8ClampedArray, colour: Colour, index: number) {
    const alpha = colour[3] / 255;
    const invAlpha = 1 - alpha;
    colour[0] = Math.round(colour[0] * alpha + data[index] * invAlpha);
    colour[1] = Math.round(colour[1] * alpha + data[index + 1] * invAlpha);
    colour[2] = Math.round(colour[2] * alpha + data[index + 2] * invAlpha);
    colour[3] = Math.round(colour[3] + data[index + 3] * invAlpha);
}

function blendAdd(data: Uint8ClampedArray, colour: Colour, index: number) {
    colour[0] = Math.min(255, colour[0] + data[index]);
    colour[1] = Math.min(255, colour[1] + data[index + 1]);
    colour[2] = Math.min(255, colour[2] + data[index + 2]);
    colour[3] = Math.min(255, colour[3] + data[index + 3]);
}