import { BlendMode, FrameBuffer } from "../lib/FrameBuffer";
import { Sampler } from "../lib/Sampler";
import textureURL from '../assets/texture.png';
import { Point } from "../lib/Types";
import { loadTexture, Texture } from "../lib/Texture";
import { Stage } from "../pixi/Stage";
import { Container } from "../pixi/Container";
import { DisplayObject } from "../pixi/DisplayObject";
import { Sprite } from "../pixi/Sprite";
import { SpriteTexture } from "../pixi/SpriteTexture";
import { Rectangle } from "../pixi/utils";
import { Uniforms, RenderParams, drawTriangles, vertexShader, fragmentShader } from "./Lesson-2";
import { drawDisplayList } from "../pixi/PixiSpriteRenderer";

export async function lesson5_1(screenCtx: CanvasRenderingContext2D, fb: FrameBuffer) {

  const sampler: Sampler = new Sampler();
  const uniforms: Uniforms = { sampler };

  const params: RenderParams = { blendMode: BlendMode.Normal };

  let drawCallsPerFrame = 0;

  const texture = await loadTexture(textureURL);

  const stage = new Stage();

  const spriteTexture = new SpriteTexture(texture, new Rectangle(0, 0, (1024 / 8) - 1, (1024 / 8) - 1));
  const sprite = new Sprite();
  sprite.texture = spriteTexture;
  sprite.scale.x = sprite.scale.y = 0.5;

  stage.addChild(sprite);

  function draw(fb: FrameBuffer, vertexData: Point[], uvData: Point[], texture: Texture, blendMode: BlendMode, count: number) {
    sampler.bind(texture);
    params.blendMode = blendMode;
    drawTriangles(fb, count * 2, { vertex: vertexData, uv: uvData }, uniforms, vertexShader, fragmentShader, params);
    drawCallsPerFrame++;
  }

  drawDisplayList(fb, stage, draw);
  fb.write(screenCtx);
  console.log("drawCallsPerFrame", drawCallsPerFrame);
}

