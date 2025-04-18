import { BlendMode, DrawingBuffer } from "../lib/DrawingBuffer";
import { Sampler } from "../lib/Sampler";
import greenBallonTextureURL from '../assets/BalloonGreen.webp';
import redBallonTextureURL from '../assets/BalloonRed.webp';
import { Point } from "../lib/Types";
import { loadTexture, Texture } from "../lib/Texture";
import { Stage } from "../pixi/Stage";
import { Sprite } from "../pixi/Sprite";
import { SpriteTexture } from "../pixi/SpriteTexture";
import { Rectangle } from "../pixi/Rectangle";
import { Uniforms, RenderParams, drawTriangles, vertexShader, fragmentShader } from "./Lesson-2-2";
import { drawDisplayList } from "../pixi/PixiJsGLSpriteRenderer";
import { onTick } from "../utils/Ticker";

export async function lesson6_1(screenCtx: CanvasRenderingContext2D, db: DrawingBuffer) {

  const sampler: Sampler = new Sampler();
  const uniforms: Uniforms = { sampler };

  const params: RenderParams = { blendMode: BlendMode.Normal };

  let drawCallsPerFrame = 0;

  const greenBallonSourceTexture = await loadTexture(greenBallonTextureURL);
  const redBallonSourceTexture = await loadTexture(redBallonTextureURL);

  const stage = new Stage();

  let ballons: Sprite[] = [];
  const greenBallonTexture = new SpriteTexture(greenBallonSourceTexture, new Rectangle(0, 0, 105, 156));
  const redBallonTexture = new SpriteTexture(redBallonSourceTexture, new Rectangle(0, 0, 105, 156));

  function draw(db: DrawingBuffer, vertexData: Point[], uvData: Point[], texture: Texture, blendMode: BlendMode, count: number) {
    sampler.bind(texture);
    params.blendMode = blendMode;
    drawTriangles(db, count * 2, { vertex: vertexData, uv: uvData }, uniforms, vertexShader, fragmentShader, params);
    drawCallsPerFrame++;
  }

  const tick = (dt: number, step:number) => {
    db.clear();

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

    ballons = ballons.map((ballon, i) => {
      ballon.position.y -= 1 + (i * 0.25);
      ballon.rotation = Math.sin((step / 100) + i/10) * 0.1;
      ballon.scale.x = 0.5 + Math.sin(step / 100) * 0.025;
      ballon.scale.y = 0.5 + Math.cos(step / 100 + i) * 0.0125;
      if (ballon.position.y < -100) {
        stage.removeChild(ballon);
        return null;
      }
      return ballon;
    }).filter(ballon => ballon !== null);

    drawDisplayList(db, stage, draw);
    db.write(screenCtx);
    drawCallsPerFrame = 0;
    return true;
  }

  onTick(tick);

}
