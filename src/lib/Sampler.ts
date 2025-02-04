import { Colour } from "./Types";

export class Sampler {
    
    texture: ImageData;
    
    private prevX: number = 0;
    private prevY: number = 0;

    private textureWidth: number = 0;
    private textureHeight: number = 0;

    constructor() {
    }

    bind(texture: ImageData) {
        this.texture = texture;
        // Cache the width and height for faster sampling
        this.textureWidth = texture.width;
        this.textureHeight = texture.height;
    }

    unbind() {
        this.texture = null;
    }

    sample(u: number, v: number, result: Colour) {
        let x = ~~(u * this.textureWidth) % this.textureWidth;
        let y = ~~(v * this.textureHeight) % this.textureHeight;
        if (x === this.prevX && y === this.prevY) {
            return;
        }
        this.prevX = x; this.prevY = y;
        const cell = 4 * (x + y * this.textureWidth);
        result[0] = this.texture.data[cell + 0];
        result[1] = this.texture.data[cell + 1];
        result[2] = this.texture.data[cell + 2];
        result[3] = this.texture.data[cell + 3];
    }
}

export type SamplerIndex = number;
