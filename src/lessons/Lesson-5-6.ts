import { BlendMode, DrawingBuffer } from "../lib/DrawingBuffer";
import { Sampler } from "../lib/Sampler";
import gameFontURL from '../assets/font.png';
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

export async function lesson5_6(screenCtx: CanvasRenderingContext2D, db: DrawingBuffer) {

  const sampler: Sampler = new Sampler();
  const uniforms: Uniforms = { sampler };

  const params: RenderParams = { blendMode: BlendMode.Normal };

  let drawCallsPerFrame = 0;

  const gameFontTextures = await loadTexture(gameFontURL);

  const stage = new Stage();

  const fontSprites = new BitmapFont(gameFontTextures, fontConfig);
  fontSprites.create();

  function draw(db: DrawingBuffer, vertexData: Point[], uvData: Point[], texture: Texture, blendMode: BlendMode, count: number) {
    sampler.bind(texture);
    params.blendMode = blendMode;
    drawTriangles(db, count * 2, { vertex: vertexData, uv: uvData }, uniforms, vertexShader, fragmentShader, params);
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


  function initText(text: string, y: number, startX: number, time: number, sprites: Sprite[], onFinished: Promise<unknown>[]): Sprite[] {
    calcCenteredPosition(320, text, 3).forEach((x, i) => {
      const sprite = new Sprite();
      sprite.texture = fontSprites.textures.get(text.charAt(i).toUpperCase());
      sprite.scale.setTo(3, 3);
      sprite.anchor.setTo(0.5, 0.5);
      sprite.position.x = startX + (i * 100);
      sprite.position.y = y;
      stage.addChild(sprite);

      onFinished.push(tween(sprite.position, "x", x, time, easeOutBack));
      sprites.push(sprite);
    });
    return sprites;
  }

  const letters: Sprite[] = [];
  const onFinished: Promise<unknown>[] = [];
  initText("Thanks", 100, 400, 2000, letters, onFinished);
  initText("for", 125, -600, 2000, letters, onFinished);
  initText("watching", 150, 600, 3000, letters, onFinished);

  let phase = 0;

  const tick
    = (dt: number, step: number) => {
      db.clear();

      if (phase === 0) {
        letters.forEach((l, i) => {
          l.scale.x = 3 + Math.sin(step / 100 + i) * 0.75;
          l.scale.y = 3 + Math.cos(step / 100 + i) * 0.5;
          l.rotation = Math.sin((step + i) / 100) * 0.15;
        });
      } else {
        const angleStep = Math.PI * 2 / letters.length;
        letters.forEach((l, i) => {
          const r = step / 1000;
          const radius = 100 + (1 + Math.sin(r)*30);
          l.scale.x = 3;
          l.scale.y = 3;
          l.rotation += 0.01;
          const tX = 150 + Math.cos(r+angleStep*i) * radius;
          const tY = 125 + Math.sin(r+angleStep*i) * radius;
          l.position.x += (tX - l.position.x)*0.01;
          l.position.y += (tY - l.position.y)*0.01;
        });
      }

      drawDisplayList(db, stage, draw);
      db.write(screenCtx);
      console.log("Draw Calls = ", drawCallsPerFrame);
      drawCallsPerFrame = 0;
      return true;
    }

  onTick(tick);
  await Promise.all(onFinished);
  await delay(2000);
  letters.reverse();
  // letters.sort(() => Math.random() - 0.5);
  phase = 1;
}
