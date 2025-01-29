import { BlendMode, DrawingBuffer } from "../lib/DrawingBuffer";
import { Sampler } from "../lib/Sampler";
import scrollURL from '../assets/scroll.png';
import { Point } from "../lib/Types";
import { loadTexture, Texture } from "../lib/Texture";
import { Stage } from "../pixi/Stage";
import { Sprite } from "../pixi/Sprite";
import { Uniforms, RenderParams, drawTriangles, vertexShader, fragmentShader } from "./Lesson-2-2";
import { drawDisplayList } from "../pixi/PixiJsGLSpriteRenderer";
import { BitmapFont } from "../pixi/SpriteSheet";
import { fontConfig } from "../assets/font";
import { delay, easeOutBack, tween, TweenConfig } from "../utils/Tween";
import { onTick } from "../utils/Ticker";
import { Rectangle } from "../pixi/utils";
import { SpriteTexture } from "../pixi/SpriteTexture";

export async function lesson5_7(screenCtx: CanvasRenderingContext2D, db: DrawingBuffer) {

  const sampler: Sampler = new Sampler();
  const uniforms: Uniforms = { sampler };

  const params: RenderParams = { blendMode: BlendMode.Normal };

  let drawCallsPerFrame = 0;

  const gameFontTextures = await loadTexture(scrollURL);
  const scrollTexture = new SpriteTexture(gameFontTextures, new Rectangle(0, 0, 95, 19));

  const stage = new Stage();
  const scroll = new Sprite();
  scroll.texture = scrollTexture;
  scroll.scale.x = 2;
  scroll.scale.y = 2;
  scroll.anchor.x = 0.5;
  scroll.anchor.y = 0.5;
  scroll.position.x = 150;
  scroll.position.y = 50;
  stage.addChild(scroll);

  function draw(db: DrawingBuffer, vertexData: Point[], uvData: Point[], texture: Texture, blendMode: BlendMode, count: number) {
    sampler.bind(texture);
    params.blendMode = blendMode;
    drawTriangles(db, count * 2, { vertex: vertexData, uv: uvData }, uniforms, vertexShader, fragmentShader, params);
    drawCallsPerFrame++;
  }

  const tick
    = (dt: number, step: number) => {
      db.clear();
      scroll.scale.x = 2 + Math.sin(step / 100) * 0.125;

      drawDisplayList(db, stage, draw);
      db.write(screenCtx);
      console.log("Draw Calls = ", drawCallsPerFrame);
      drawCallsPerFrame = 0;
      return true;
    }

  onTick(tick);
}
