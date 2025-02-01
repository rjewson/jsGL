import { Clip } from "./Clip";
import { Colour, Point } from "./Types";

export enum BlendMode {
    Normal,
    Add
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
        // Overwrite the existing pixel data unless the new pixel is fully transparent
        // var index = 4 * (x + y * this.width);
        if (colour[3] === 0) {
            return;
        }
        // // This is faster than setting the individual RGBA values
        // this.data.set(colour, index);

        // Blend the new pixel correctly with alpha blending
        const index = 4 * (x + y * this._width);
        // const alpha = colour[3] / 255;
        // const invAlpha = 1 - alpha;

        // var existingColour_r = this.data[index];
        // var existingColour_g = this.data[index+1];
        // var existingColour_b = this.data[index+2];
        // var existingColour_a = this.data[index+3];
        // this.data[index] = Math.round(colour[0] * alpha + existingColour_r * invAlpha);
        // this.data[index + 1] = Math.round(colour[1] * alpha + existingColour_g * invAlpha);
        // this.data[index + 2] = Math.round(colour[2] * alpha + existingColour_b * invAlpha);
        // this.data[index + 3] = Math.round(colour[3] + existingColour_a * invAlpha);

        // colour[0] = Math.round(colour[0] * alpha + this.data[index] * invAlpha);
        // colour[1] = Math.round(colour[1] * alpha + this.data[index + 1] * invAlpha);
        // colour[2] = Math.round(colour[2] * alpha + this.data[index + 2] * invAlpha);
        // colour[3] = Math.round(colour[3] + this.data[index + 3] * invAlpha);
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
            this.blendFn = mode === BlendMode.Normal ? blendNormal : blendAdd;
        }
    }

    setClip(clip: Clip) {
        this.clip = clip;
    }

    clearClip() {
        this.clip = this.defaultClip;
    }

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