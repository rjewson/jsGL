export class FrameBuffer {
    canvas: OffscreenCanvas;
    ctx: OffscreenCanvasRenderingContext2D;
    imageData: ImageData;

    constructor(width: number, height: number) {
        this.canvas = new OffscreenCanvas(width, height);
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
        this.imageData = this.ctx.getImageData(0, 0, width, height);
    }

    setPixel(x: number, y: number, r: number, g: number, b: number, a: number): void {
        // x = Math.floor(x);
        // y = Math.floor(y);
        var index = 4 * (x + y * this.imageData.width);
        this.imageData.data[index + 0] = r;
        this.imageData.data[index + 1] = g;
        this.imageData.data[index + 2] = b;
        this.imageData.data[index + 3] = a;
    }

    write(outputCtx: CanvasRenderingContext2D): void {
        outputCtx.putImageData(this.imageData, 0, 0);
    }

    clear(): void { 
        this.imageData.data.fill(0);
    }

    blendMode(mode: string): void {
    }
}