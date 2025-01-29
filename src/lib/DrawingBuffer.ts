import { Clip } from "./Clip";
import { Colour, Point } from "./Types";

export enum BlendMode {
    Normal,
    Add,
    Multiply
}

export class DrawingBuffer extends ImageData {

    public clip: Clip;
    private defaultClip: Clip;
    private blend: BlendMode;

    constructor(width: number, height: number) {
        super(width, height);
        this.defaultClip = new Clip(0, 0, width, height);
        this.setClip(this.defaultClip);
        this.blendMode(BlendMode.Normal);

    }

    set(x: number, y: number, colour: Colour): void {
        // Overwrite the existing pixel data unless the new pixel is fully transparent
        // var index = 4 * (x + y * this.width);
        // if (colour[3] === 0) {
        //     return;
        // }
        // // This is faster than setting the individual RGBA values
        // this.data.set(colour, index);

        // Blend the new pixel correctly with alpha blending
        var index = 4 * (x + y * this.width);
        var existingColour_r = this.data[index];
        var existingColour_g = this.data[index+1];
        var existingColour_b = this.data[index+2];
        var existingColour_a = this.data[index+3];

        var alpha = colour[3] / 255;
        var invAlpha = 1 - alpha;

        this.data[index] = Math.round(colour[0] * alpha + existingColour_r * invAlpha);
        this.data[index + 1] = Math.round(colour[1] * alpha + existingColour_g * invAlpha);
        this.data[index + 2] = Math.round(colour[2] * alpha + existingColour_b * invAlpha);
        this.data[index + 3] = Math.round(colour[3] + existingColour_a * invAlpha);
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
        }
    }

    setClip(clip: Clip) {
        this.clip = clip;
    }

    clearClip() {
        this.clip = this.defaultClip;
    }

}