import { BlendMode, DrawingBuffer } from "../lib/DrawingBuffer";
import { Sampler } from "../lib/Sampler";
import textureURL from '../assets/texture.png';
import { Point } from "../lib/Types";
import { loadTexture, Texture } from "../lib/Texture";
import { Stage } from "../pixi/Stage";
import { Sprite } from "../pixi/Sprite";
import { SpriteTexture } from "../pixi/SpriteTexture";
import { Rectangle } from "../pixi/utils";
import { Uniforms, RenderParams, drawTriangles, vertexShader, fragmentShader } from "./Lesson-2-2";
import { drawDisplayList } from "../pixi/PixiJsGLSpriteRenderer";

export async function lesson5_1(screenCtx: CanvasRenderingContext2D, db: DrawingBuffer) {

  const sampler: Sampler = new Sampler();
  const uniforms: Uniforms = { sampler };

  const params: RenderParams = { blendMode: BlendMode.Normal };

  let drawCallsPerFrame = 0;

  const texture = await loadTexture(textureURL);

  const stage = new Stage();

  const spriteTexture = new SpriteTexture(texture, new Rectangle(0, 0, (1024 / 8) - 1, (1024 / 8) - 1));
  const sprite = new Sprite();
  sprite.texture = spriteTexture;
  sprite.position.x = 75;
  sprite.position.y = 75;
  sprite.scale.x = sprite.scale.y = 0.5;

  stage.addChild(sprite);

  function draw(db: DrawingBuffer, vertexData: Point[], uvData: Point[], texture: Texture, blendMode: BlendMode, count: number) {
    sampler.bind(texture);
    params.blendMode = blendMode;
    drawTriangles(db, count * 2, { vertex: vertexData, uv: uvData }, uniforms, vertexShader, fragmentShader, params);
    drawCallsPerFrame++;
  }

  drawDisplayList(db, stage, draw);
  db.write(screenCtx);
  console.log("Draw Calls = ", drawCallsPerFrame);

}

