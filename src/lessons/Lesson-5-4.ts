import { FrameBuffer } from "../lib/FrameBuffer";
import { Sampler } from "../lib/Sampler";
import greenBallonTextureURL from '../assets/BalloonGreen.webp';
import redBallonTextureURL from '../assets/BalloonRed.webp';
import { Point } from "../lib/Types";
import { loadTexture, Texture } from "../lib/Texture";
import { Stage } from "../pixi/Stage";
import { Sprite } from "../pixi/Sprite";
import { SpriteTexture } from "../pixi/SpriteTexture";
import { Rectangle } from "../pixi/utils";
import { updateFunctions } from "../main";
import { Uniforms, RenderParams, drawTriangles, vertexShader, fragmentShader } from "./Lesson-2";
import { drawDisplayList } from "../pixi/PixiSpriteRenderer";



export async function lesson5_4(screenCtx: CanvasRenderingContext2D, fb: FrameBuffer) {

  const sampler: Sampler = new Sampler();
  const uniforms: Uniforms = { sampler };

  const params: RenderParams = { blendMode: 'normal' };

  let drawCallsPerFrame = 0;

  const greenBallonSourceTexture = await loadTexture(greenBallonTextureURL);
  const redBallonSourceTexture = await loadTexture(redBallonTextureURL);

  const stage = new Stage();

  let time = 0;
  let ballons: Sprite[] = [];
  const greenBallonTexture = new SpriteTexture(greenBallonSourceTexture, new Rectangle(0, 0, 105, 156));
  const redBallonTexture = new SpriteTexture(redBallonSourceTexture, new Rectangle(0, 0, 105, 156));

  function draw(fb: FrameBuffer, vertexData: Point[], uvData: Point[], texture: Texture, count: number) {
    sampler.bind(texture);
    drawTriangles(fb, count * 2, { vertex: vertexData, uv: uvData }, uniforms, vertexShader, fragmentShader, params);
    drawCallsPerFrame++;
  }

  const tick = () => {
    fb.clear();

    if (Math.random() > 0.98 && ballons.length < 10) {
      const ballon = new Sprite();
      ballon.texture = Math.random() < 0.5 ? greenBallonTexture : redBallonTexture;
      ballon.position.x = Math.random() * 300;
      ballon.position.y = 300;
      ballon.anchor.x = 0.5;
      ballon.anchor.y = 0.5;
      ballon.scale.x = ballon.scale.y = 0.5;

      stage.addChild(ballon);
      ballons.push(ballon);
    }

    ballons = ballons.map(ballon => {
      ballon.position.y -= 1;
      ballon.rotation += Math.sin(time / 10) * 0.005;
      //ballon.scale.x = ( Math.sin(time / 20) * 0.5);
      if (ballon.position.y < -100) {
        stage.removeChild(ballon);
        return null;
      }
      return ballon;
    }).filter(ballon => ballon !== null);

    drawDisplayList(fb, stage, draw);
    fb.write(screenCtx);
    console.log("drawCallsPerFrame", drawCallsPerFrame);
    drawCallsPerFrame = 0;
    time++;
  }

  updateFunctions.push(tick);

}
