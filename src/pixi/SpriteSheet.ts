import { Texture } from "../lib/Texture";
import { SpriteTexture } from "./SpriteTexture";
import { Rectangle, Vector2 } from "./utils";

export type SpriteSheetConfig = { [key: string]: { x: number, y: number, width: number, height: number } };

export class BitmapFont {
    baseTexture: Texture;
    config: SpriteSheetConfig;
    textures: Map<string, SpriteTexture>;

    constructor(baseTexture: Texture, config: SpriteSheetConfig) {
        this.baseTexture = baseTexture;
        this.config = config;
        this.textures = new Map();
    }

    create() {
        for (const key in this.config) {
            if (Object.prototype.hasOwnProperty.call(this.config, key)) {
                const { x, y, width, height}  = this.config[key];
                const texture = new SpriteTexture(this.baseTexture, new Rectangle(x, y, width, height),new Vector2(4,4));
                this.textures.set(key, texture);
            }
        }
    }
}