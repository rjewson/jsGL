import { BlendMode, DrawingBuffer } from "../lib/DrawingBuffer";
import { Sampler } from "../lib/Sampler";
import greenBallonTextureURL from '../assets/BalloonGreen.webp';
import redBallonTextureURL from '../assets/BalloonRed.webp';
import { Point } from "../lib/Types";
import { loadTexture, Texture } from "../lib/Texture";
import { Stage } from "../pixi/Stage";
import { Sprite } from "../pixi/Sprite";
import { SpriteTexture } from "../pixi/SpriteTexture";
import { Rectangle } from "../pixi/utils";
import { Uniforms, RenderParams, drawTriangles, vertexShader, fragmentShader } from "./Lesson-2-2";
import { drawDisplayList } from "../pixi/PixiJsGLSpriteRenderer";
import { createPane } from "../utils/Options";
import { onTick } from "../utils/Ticker";

export async function lesson5_3(screenCtx: CanvasRenderingContext2D, db: DrawingBuffer) {

  const sampler: Sampler = new Sampler();
  const uniforms: Uniforms = { sampler };

  const params: RenderParams = { blendMode: BlendMode.Normal };

  let drawCallsPerFrame = 0;

  const greenBallonSourceTexture = await loadTexture(greenBallonTextureURL);
  const redBallonSourceTexture = await loadTexture(redBallonTextureURL);

  const stage = new Stage();

  const greenBallonTexture = new SpriteTexture(greenBallonSourceTexture, new Rectangle(0, 0, 105, 156));
  const redBallonTexture = new SpriteTexture(redBallonSourceTexture, new Rectangle(0, 0, 105, 156));

  function draw(db: DrawingBuffer, vertexData: Point[], uvData: Point[], texture: Texture, blendMode: BlendMode, count: number) {
    sampler.bind(texture);
    params.blendMode = blendMode;
    drawTriangles(db, count * 2, { vertex: vertexData, uv: uvData }, uniforms, vertexShader, fragmentShader, params);
    drawCallsPerFrame++;
  }

  // Make it dynamic with tweekpane
  const pane = createPane();
  const lessonOptions = {
    count: 4,
  };
  const instanceCount = pane.addBinding(lessonOptions, 'count', {
    min: 0,
    max: 9,
    step: 1,
  });

  const ballons: Sprite[] = [];

  function updateStage() {
    stage.removeAllChildren();
    ballons.length = 0;
    for (let count = 0; count < lessonOptions.count; count++) {
      const ballon = new Sprite();
      ballon.texture = count % 2 === 0 ? greenBallonTexture : redBallonTexture;
      const gridSize = Math.ceil(Math.sqrt(lessonOptions.count));
      const padding = 5;
      const spriteWidth = 105 * 0.5;
      const spriteHeight = 156 * 0.5;
      const totalWidth = gridSize * (spriteWidth + padding) - padding;
      const totalHeight = gridSize * (spriteHeight + padding) - padding;
      const startX = (300 - totalWidth) / 2;
      const startY = (250 - totalHeight) / 2;

      ballon.position.x = startX + (count % gridSize) * (spriteWidth + padding) + spriteWidth / 2;
      ballon.position.y = startY + Math.floor(count / gridSize) * (spriteHeight + padding) + spriteHeight / 2;
      
      ballon.scale.setTo(0.5, 0.5);
      ballon.anchor.setTo(0.5, 0.5);
      stage.addChild(ballon);
      ballons.push(ballon);
    }
  }

  instanceCount.on('change',updateStage);
  updateStage();
  // end tweekpane

  const tick = (dt: number, step: number) => {
    db.clear();

    ballons.forEach((ballon, i) => {
      ballon.rotation = Math.sin((step / 100) + i/10) * 0.1;
    });

    drawDisplayList(db, stage, draw);
    db.write(screenCtx);
    console.log("Draw Calls = ", drawCallsPerFrame);
    drawCallsPerFrame = 0;
    return true;
  }

  onTick(tick);
}

