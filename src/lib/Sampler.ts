import { Colour } from "./Types";

export class Sampler {
    
    texture: ImageData;
    
    private prevX: number = 0;
    private prevY: number = 0;

    constructor() {
    }

    bind(texture: ImageData) {
        this.texture = texture;
    }

    unbind() {
        this.texture = null;
    }

    sample(u: number, v: number, result: Colour) {

        const width = this.texture.width;
        const height = this.texture.height;
        const x = Math.floor(u * width);
        const y = Math.floor(v * height);
        if (x === this.prevX && y === this.prevY) {
            return;
        }
        this.prevX = x; this.prevY = y;
        const cell = y * (width * 4) + x * 4;
        // return [this.texture.imageData.data[cell + 0], this.texture.imageData.data[cell + 1], this.texture.imageData.data[cell + 2], this.texture.imageData.data[cell + 3]];
        result[0] = this.texture.data[cell + 0];
        result[1] = this.texture.data[cell + 1];
        result[2] = this.texture.data[cell + 2];
        result[3] = this.texture.data[cell + 3];
    }
}

export type SamplerIndex = number;
