import { Texture } from "../lib/Texture";
import { Rectangle } from "./Rectangle";

export class SpriteTexture {
    public baseTexture: Texture;
    public frame: Rectangle;
    public noFrame: boolean;
    public uvs: Float32Array;

    constructor(baseTexture: Texture, frame: Rectangle = undefined) {
        this.baseTexture = baseTexture;

        if (!frame) {
            this.noFrame = true;
            this.frame = new Rectangle(0, 0, 1, 1);
        } else {
            this.noFrame = false;
            this.frame = frame;
        }

        this.uvs = new Float32Array(8);

        this.updateUVS();
    }

    public updateUVS() {
        var tw = this.baseTexture.width;
        var th = this.baseTexture.height;

        this.uvs[0] = this.frame.x / tw;
        this.uvs[1] = this.frame.y / th;

        this.uvs[2] = (this.frame.x + this.frame.width) / tw;
        this.uvs[3] = this.frame.y / th;

        this.uvs[4] = (this.frame.x + this.frame.width) / tw;
        this.uvs[5] = (this.frame.y + this.frame.height) / th;

        this.uvs[6] = this.frame.x / tw;
        this.uvs[7] = (this.frame.y + this.frame.height) / th;
    }
}