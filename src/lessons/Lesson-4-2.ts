import { BlendMode, DrawingBuffer } from "../lib/DrawingBuffer";
import { Sampler } from "../lib/Sampler";
import textureURL from '../assets/texture.png';
import { Point } from "../lib/Types";
import { loadTexture, Texture } from "../lib/Texture";
import { Stage } from "../pixi/Stage";
import { Sprite } from "../pixi/Sprite";
import { SpriteTexture } from "../pixi/SpriteTexture";
import { Uniforms, RenderParams, drawTriangles, vertexShader, fragmentShader } from "./Lesson-2-2";
import { drawDisplayList } from "../pixi/PixiJsGLSpriteRenderer";
import { onTick } from "../utils/Ticker";
import { Rectangle } from "../pixi/Rectangle";

// Example 2 - Simple displaylist example. 1 Sprite with 1 texture and 1 child sprite with second texture
export async function lesson4_2(screenCtx: CanvasRenderingContext2D, db: DrawingBuffer) {

  const sampler: Sampler = new Sampler();
  const uniforms: Uniforms = { sampler };

  const params: RenderParams = { blendMode: BlendMode.Normal };

  let drawCallsPerFrame = 0;

  const texture = await loadTexture(textureURL);

  const stage = new Stage();

  const spriteTexture = new SpriteTexture(texture, new Rectangle(0, 0, 127, 127));
  const sprite = new Sprite();
  sprite.position.x = 150;
  sprite.position.y = 100;
  sprite.texture = spriteTexture;
  sprite.scale.x = sprite.scale.y = 0.5;

  // const spriteTexture2 = new SpriteTexture(texture, new Rectangle(128, 0, 127, 127));
  const spriteTexture2 = new SpriteTexture(texture, new Rectangle(128, 0, 127, 127));
  const sprite2 = new Sprite();
  sprite2.texture = spriteTexture2;
  sprite2.scale.setTo(0.5,0.5);
  sprite2.anchor.setTo(0.5, 0.5);
  sprite2.position.x = 0;
  sprite2.position.y = 0;

  stage.addChild(sprite);
  sprite.addChild(sprite2);

  function draw(db: DrawingBuffer, vertexData: Point[], uvData: Point[], texture: Texture, blendMode: BlendMode, count: number) {
    sampler.bind(texture);
    params.blendMode = blendMode;
    drawTriangles(db, count * 2, { vertex: vertexData, uv: uvData }, uniforms, vertexShader, fragmentShader, params);
    drawCallsPerFrame++;
  }

  const tick = (dt: number, step: number) => {
    db.clear();
    drawDisplayList(db, stage, draw);
    sprite.position.x = 150 + Math.sin(step / 300) * 50;
    sprite.rotation += 0.01;
    sprite2.rotation += 0.01;
    sprite2.scale.x = 0.5 + Math.sin(step / 100) * 0.25;
    db.write(screenCtx);
    return true;
  }
  onTick(tick);
}
