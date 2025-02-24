import { BlendMode, DrawingBuffer } from "../lib/DrawingBuffer";
import { Sampler } from "../lib/Sampler";
import greenBallonTextureURL from '../assets/BalloonGreen.webp';
import redBallonTextureURL from '../assets/BalloonRed.webp';
import ballonSpritesheetURL from '../assets/spritesheet.png';
import { Point } from "../lib/Types";
import { loadTexture, Texture } from "../lib/Texture";
import { Stage } from "../pixi/Stage";
import { Sprite } from "../pixi/Sprite";
import { SpriteTexture } from "../pixi/SpriteTexture";
import { Rectangle } from "../pixi/Rectangle";
import { Uniforms, RenderParams, drawTriangles, vertexShader, fragmentShader } from "./Lesson-2-2";
import { drawDisplayList } from "../pixi/PixiJsGLSpriteRenderer";
import { createPane } from "../utils/Options";



export async function lesson5_1(screenCtx: CanvasRenderingContext2D, db: DrawingBuffer) {

  const sampler: Sampler = new Sampler();
  const uniforms: Uniforms = { sampler };

  const params: RenderParams = { blendMode: BlendMode.Normal };

  let drawCallsPerFrame = 0;

  const greenBallonSourceTexture = await loadTexture(greenBallonTextureURL);
  const redBallonSourceTexture = await loadTexture(redBallonTextureURL);
  const ballonsSpritesSheetSourceTexture = await loadTexture(ballonSpritesheetURL);

  function draw(db: DrawingBuffer, vertexData: Point[], uvData: Point[], texture: Texture, blendMode: BlendMode, count: number) {
    sampler.bind(texture);
    params.blendMode = blendMode;
    drawTriangles(db, count * 2, { vertex: vertexData, uv: uvData }, uniforms, vertexShader, fragmentShader, params);
    drawCallsPerFrame++;
  }

  // Make it dynamic with tweekpane
  const lessonOptions = {
    useSpriteSheet: false,
    alternateSprites: false,
    alternateBlendModes: false,
    drawCalls: 0
  };

  const pane = createPane();

  const b0 = pane.addBinding(lessonOptions, 'useSpriteSheet');
  const b1 = pane.addBinding(lessonOptions, 'alternateSprites');
  const b2 = pane.addBinding(lessonOptions, 'alternateBlendModes');
  pane.addBinding(lessonOptions, 'drawCalls', {
    readonly: true,
    view: 'graph',
    min: 0,
    max: 20,
  });

  [b0, b1, b2].forEach(b => {
    b.on('change', (_) => {
      renderExample(lessonOptions.useSpriteSheet, lessonOptions.alternateSprites, lessonOptions.alternateBlendModes);
    });
  })
  // end tweekpane

  function renderExample(useSpriteSheet: boolean, alternateSprites: boolean, alternateBlendModes: boolean) {

    console.log("---");
    console.log(`Render %c${useSpriteSheet}/${alternateSprites}/${alternateBlendModes}`, "color: blue;");

    const stage = new Stage();

    let greenBallonTexture: SpriteTexture = null;
    let redBallonTexture: SpriteTexture = null;

    if (!useSpriteSheet) {
      // Use separate textures for each sprite
      greenBallonTexture = new SpriteTexture(greenBallonSourceTexture, new Rectangle(0, 0, 105, 156));
      redBallonTexture = new SpriteTexture(redBallonSourceTexture, new Rectangle(0, 0, 105, 156));
    } else {
      // Combine ballons into spritesheet
      greenBallonTexture = new SpriteTexture(ballonsSpritesSheetSourceTexture, new Rectangle(0, 0, 105, 156));
      redBallonTexture = new SpriteTexture(ballonsSpritesSheetSourceTexture, new Rectangle(109, 0, 105, 156));
    }

    for (let count = 0; count < 20; count++) {
      const ballon = new Sprite();
      if (alternateSprites) {
        ballon.texture = count % 2 === 0 ? greenBallonTexture : redBallonTexture;
      } else {
        ballon.texture = count < 10 ? greenBallonTexture : redBallonTexture;
      }
      if (alternateBlendModes) {
        ballon.blendMode = count % 2 === 0 ? BlendMode.Normal : BlendMode.Add;
      }

      ballon.position.x = count * 10
      ballon.position.y = 50;

      stage.addChild(ballon);
    }

    drawDisplayList(db, stage, draw);
    db.write(screenCtx);
    console.log("Draw Calls = ", drawCallsPerFrame);
    lessonOptions.drawCalls = drawCallsPerFrame;
    drawCallsPerFrame = 0;
  }

  console.log("%cDraw call explorer", "color: blue;");
  renderExample(lessonOptions.useSpriteSheet, lessonOptions.alternateSprites, lessonOptions.alternateBlendModes);

}

