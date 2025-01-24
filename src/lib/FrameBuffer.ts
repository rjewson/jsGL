import { Clip } from "./Clip";
import { Colour, Point } from "./Types";

export enum BlendMode {
    Normal,
    Add,
    Multiply
}

export class FrameBuffer extends ImageData {

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
        var index = 4 * (x + y * this.width);
        if (colour[3] === 0) {
            return;
        }
        // This is faster than setting the individual RGBA values
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
        }
    }

    setClip(clip: Clip) {
        this.clip = clip;
    }

    clearClip() {
        this.clip = this.defaultClip;
    }

}

function blendRGBA(srcColor: Colour, dstColor: Colour): Colour {
    // srcColor and dstColor should be in the form of [R, G, B, A] where A is from 0 to 1
    const srcAlpha = srcColor[3];
    const dstAlpha = dstColor[3];

    // Blending formula
    const outAlpha = srcAlpha + dstAlpha * (1 - srcAlpha);

    // If the result alpha is zero, return a fully transparent color
    if (outAlpha === 0) {
        return [0, 0, 0, 0];
    }

    // Blend the RGB values using the alpha blending formula
    const outRed = (srcColor[0] * srcAlpha + dstColor[0] * dstAlpha * (1 - srcAlpha)) / outAlpha;
    const outGreen = (srcColor[1] * srcAlpha + dstColor[1] * dstAlpha * (1 - srcAlpha)) / outAlpha;
    const outBlue = (srcColor[2] * srcAlpha + dstColor[2] * dstAlpha * (1 - srcAlpha)) / outAlpha;

    return [outRed, outGreen, outBlue, outAlpha];
}