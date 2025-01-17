import { Colour } from "./Types";

export class FrameBuffer extends ImageData {

    constructor(width: number, height: number) {
        super(width, height);
    }

    setPixel(x: number, y: number, colour: Colour): void {
        var index = 4 * (x + y * this.width);
        if (colour[3] === 0) {
            return;
        }
        // const dstColor: Colour = [this.imageData.data[index + 0], this.imageData.data[index + 1], this.imageData.data[index + 2], this.imageData.data[index + 3]];
        // const final = blendRGBA(colour, dstColor);
        // this.imageData.data.set(final, index);

        // This is faster than setting the individual RGBA values
        
        this.data.set(colour, index);
        
        // this.imageData.data[index + 0] = r;
        // this.imageData.data[index + 1] = g;
        // this.imageData.data[index + 2] = b;
        // this.imageData.data[index + 3] = a;
    }

    write(outputCtx: CanvasRenderingContext2D): void {
        outputCtx.putImageData(this, 0, 0);
    }
    
    clear(): void {
        this.data.fill(0);
    }

    blendMode(mode: string): void {
    }

    clip(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
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