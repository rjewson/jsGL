import { SpriteSheetConfig } from "../pixi/SpriteSheet";

export const fontConfig: SpriteSheetConfig = {};
let i = 0;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!.?";
for (let y = 1; y < 57; y += 8) {
    for (let x = 1; x < 49; x += 8) {
        fontConfig[letters[i++]] = { x: x, y, width: 7, height: 7 };
    }
}
