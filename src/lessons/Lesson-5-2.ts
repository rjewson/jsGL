import { FrameBuffer } from "../lib/FrameBuffer";
import { Sampler } from "../lib/Sampler";
import textureURL from '../assets/texture.png';
import greenBallonTextureURL from '../assets/BalloonGreen.webp';
import { Point } from "../lib/Types";
import { loadTexture, Texture } from "../lib/Texture";
import { Stage } from "../pixi/Stage";
import { Sprite } from "../pixi/Sprite";
import { SpriteTexture } from "../pixi/SpriteTexture";
import { Rectangle } from "../pixi/utils";
import { Uniforms, RenderParams, drawTriangles, vertexShader, fragmentShader } from "./Lesson-2";
import { drawDisplayList } from "../pixi/PixiSpriteRenderer";

// Example 2 - Simple displaylist example. 1 Sprite with 1 texture and 1 child sprite with second texture
export async function lesson5_2(screenCtx: CanvasRenderingContext2D, fb: FrameBuffer) {

  const sampler: Sampler = new Sampler();
  const uniforms: Uniforms = { sampler };

  const params: RenderParams = { blendMode: 'normal' };

  let drawCallsPerFrame = 0;

  const texture = await loadTexture(textureURL);
  const texture2 = await loadTexture(greenBallonTextureURL);

  const stage = new Stage();

  const spriteTexture = new SpriteTexture(texture, new Rectangle(0, 0, 127, 127));
  const sprite = new Sprite();
  sprite.texture = spriteTexture;
  sprite.scale.x = sprite.scale.y = 0.5;

  // const spriteTexture2 = new SpriteTexture(texture, new Rectangle(128, 0, 127, 127));
  const spriteTexture2 = new SpriteTexture(texture2, new Rectangle(0, 0, 105, 156));
  const sprite2 = new Sprite();
  sprite2.texture = spriteTexture2;
  sprite2.scale.x = sprite2.scale.y = 0.5;
  sprite2.position.x = 100;
  sprite2.position.y = 100;
  // sprite2.rotation = Math.PI / 4;

  stage.addChild(sprite);
  sprite.addChild(sprite2);

  function draw(fb: FrameBuffer, vertexData: Point[], uvData: Point[], texture: Texture, count: number) {
    sampler.bind(texture);
    drawTriangles(fb, count * 2, { vertex: vertexData, uv: uvData }, uniforms, vertexShader, fragmentShader, params);
    drawCallsPerFrame++;
  }

  drawDisplayList(fb, stage, draw);

  fb.write(screenCtx);
  console.log("drawCallsPerFrame", drawCallsPerFrame);
}

