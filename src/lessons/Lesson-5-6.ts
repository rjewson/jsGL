import { BlendMode, FrameBuffer } from "../lib/FrameBuffer";
import { Sampler } from "../lib/Sampler";
import gameFontURL from '../assets/font.png';
import { Point } from "../lib/Types";
import { loadTexture, Texture } from "../lib/Texture";
import { Stage } from "../pixi/Stage";
import { Sprite } from "../pixi/Sprite";
import { Uniforms, RenderParams, drawTriangles, vertexShader, fragmentShader } from "./Lesson-2-2";
import { drawDisplayList } from "../pixi/PixiSpriteRenderer";
import { BitmapFont } from "../pixi/SpriteSheet";
import { fontConfig } from "../assets/font";
import { easeOutBack, easeOutBounce, easeOutQuad, tween } from "../utils/Tween";
import { onTick } from "../utils/Ticker";
import { Vector2 } from "../pixi/utils";


export async function lesson5_6(screenCtx: CanvasRenderingContext2D, fb: FrameBuffer) {

  const sampler: Sampler = new Sampler();
  const uniforms: Uniforms = { sampler };

  const params: RenderParams = { blendMode: BlendMode.Normal };

  let drawCallsPerFrame = 0;

  const gameFontTextures = await loadTexture(gameFontURL);

  const stage = new Stage();

  const fontSprites = new BitmapFont(gameFontTextures, fontConfig);
  fontSprites.create();

  function draw(fb: FrameBuffer, vertexData: Point[], uvData: Point[], texture: Texture, blendMode: BlendMode, count: number) {
    sampler.bind(texture);
    params.blendMode = blendMode;
    drawTriangles(fb, count * 2, { vertex: vertexData, uv: uvData }, uniforms, vertexShader, fragmentShader, params);
    drawCallsPerFrame++;
  }

  function calcWidth(text: string, scale: number = 1) {
    return text.split("").reduce((acc, l) => {
      return acc + fontSprites.textures.get(l.toUpperCase()).frame.width * scale + 2;
    }, 0);
  }

  function calcCenteredPosition(screenWidth: number, text: string, scale: number = 1): number[] {
    const textWidth = calcWidth(text, scale);
    const start = (screenWidth - textWidth) / 2;
    return text.split("").map((l, i) => {
      return (fontSprites.textures.get(l.toUpperCase()).frame.width * scale + 2) * i + start;
    });
  }

  

  function initText(text: string, y: number, startX: number, time: number): Sprite[] {
    const positions = calcCenteredPosition(320, text, 3);

    const sprites: Sprite[] = text.split("").map((l, i) => {
      const sprite = new Sprite();
      sprite.texture = fontSprites.textures.get(l.toUpperCase());
      sprite.scale.setTo(3, 3);
      sprite.anchor.setTo(0.5, 0.5);

      sprite.position.x = startX + (i*100);
      tween(sprite.position, "x", positions[i], time, easeOutBack);

      sprite.position.y = y;
      stage.addChild(sprite);
      return sprite;
    });
    return sprites;
  }
  const letters: Sprite[] = [...initText("Thanks", 100, 400, 2000), ...initText("for", 125, -600, 2000), ...initText("watching", 150, 600, 3000)];

  const tick
    = (dt: number, step:number) => {
      fb.clear();

      letters.forEach((l, i) => {
        l.scale.x = 3 + Math.sin(step / 100 + i) * 0.75;
        l.scale.y = 3 + Math.cos(step / 100 + i) * 0.5;
        l.rotation = Math.sin((step + i) / 100) * 0.15;

      });


      drawDisplayList(fb, stage, draw);
      fb.write(screenCtx);
      console.log("Draw Calls = ", drawCallsPerFrame);
      drawCallsPerFrame = 0;
      return true;
    }

  onTick(tick);

}
