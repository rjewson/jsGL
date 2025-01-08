import { Texture } from "./Texture";
import { Colour } from "./Types";

export class Sampler {
    texture: Texture;
    constructor() {
    }

    bind(texture: Texture) {
        this.texture = texture;
    }

    unbind() {
        this.texture = null;
    }

    sample(u: number, v: number): Colour {
        const width = this.texture.imageData.width;
        const height = this.texture.imageData.height;
        const x = Math.floor(u * width);
        const y = Math.floor(v * height);
        const cell = y * (width * 4) + x * 4;
        return [this.texture.imageData.data[cell + 0], this.texture.imageData.data[cell + 1], this.texture.imageData.data[cell + 2], this.texture.imageData.data[cell + 3]];
    }
}
