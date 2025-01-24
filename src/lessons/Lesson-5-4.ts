import { BlendMode, FrameBuffer } from "../lib/FrameBuffer";
import { Sampler } from "../lib/Sampler";
import greenBallonTextureURL from '../assets/BalloonGreen.webp';
import redBallonTextureURL from '../assets/BalloonRed.webp';
import { Point } from "../lib/Types";
import { loadTexture, Texture } from "../lib/Texture";
import { Stage } from "../pixi/Stage";
import { Sprite } from "../pixi/Sprite";
import { SpriteTexture } from "../pixi/SpriteTexture";
import { Rectangle } from "../pixi/utils";
import { Uniforms, RenderParams, drawTriangles, vertexShader, fragmentShader } from "./Lesson-2";
import { drawDisplayList } from "../pixi/PixiSpriteRenderer";



export async function lesson5_4(screenCtx: CanvasRenderingContext2D, fb: FrameBuffer) {

  const sampler: Sampler = new Sampler();
  const uniforms: Uniforms = { sampler };

  const params: RenderParams = { blendMode: BlendMode.Normal };

  let drawCallsPerFrame = 0;

  const greenBallonSourceTexture = await loadTexture(greenBallonTextureURL);
  const redBallonSourceTexture = await loadTexture(redBallonTextureURL);

  const stage = new Stage();

  let time = 0;

  const greenBallonTexture = new SpriteTexture(greenBallonSourceTexture, new Rectangle(0, 0, 105, 156));
  const redBallonTexture = new SpriteTexture(redBallonSourceTexture, new Rectangle(0, 0, 105, 156));

  function draw(fb: FrameBuffer, vertexData: Point[], uvData: Point[], texture: Texture, blendMode: BlendMode, count: number) {
    sampler.bind(texture);
    params.blendMode = blendMode;
    drawTriangles(fb, count * 2, { vertex: vertexData, uv: uvData }, uniforms, vertexShader, fragmentShader, params);
    drawCallsPerFrame++;
  }

  let lastChild = stage;

  for (let count = 0; count < 20; count++) {
    const ballon = new Sprite();
    ballon.texture = count % 2 === 0 ? greenBallonTexture : redBallonTexture;
    ballon.position.x = 10;
    ballon.position.y = 10;
    lastChild.addChild(ballon);
    lastChild = ballon;
  }


  drawDisplayList(fb, stage, draw);
  fb.write(screenCtx);
  console.log("drawCallsPerFrame", drawCallsPerFrame);
  drawCallsPerFrame = 0;
  time++;
}

