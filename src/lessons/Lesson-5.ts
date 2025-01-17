import { FrameBuffer } from "../lib/FrameBuffer";
import { blendBC, rasterizeTriangle } from "../lib/Rasterizer";
import { Sampler, SamplerIndex } from "../lib/Sampler";
import textureURL from '../assets/texture.png';
import greenBallonTextureURL from '../assets/BalloonGreen.webp';
import redBallonTextureURL from '../assets/BalloonRed.webp';
import { BarycentricPoint, BLUE, Colour, EMPTY, EMPTY_UV, Fragment, GREEN, Point, RED, UV } from "../lib/Types";
import { loadTexture, Texture } from "../lib/Texture";
import { Stage } from "../pixi/Stage";
import { Container } from "../pixi/Container";
import { DisplayObject } from "../pixi/DisplayObject";
import { Sprite } from "../pixi/Sprite";
import { SpriteTexture } from "../pixi/SpriteTexture";
import { Rectangle } from "../pixi/utils";

type Buffers = {
  vertex: Point[];
  uv: UV[];
}

type Attributes = {
  [K in keyof Buffers]: Buffers[K] extends (infer U)[] ? U : never;
}

type Varying = {
  uv: UV;
}

type Uniforms = {
  sampler: SamplerIndex;
}

type RenderParams = {
  blendMode: string;
}

function vertexShader(attributes: Attributes, uniforms: Uniforms, varying: Varying, gl_Position: Point): void {
  // copy the vertex colour value to a varying
  varying.uv = attributes.uv;
  // return the original vertex position unchanged
  // return attributes.vertex;
  gl_Position[0] = Math.floor(attributes.vertex[0]);
  gl_Position[1] = Math.floor(attributes.vertex[1]);
}

function fragmentShader(varying: Varying, uniforms: Uniforms, gl_FragColor: Colour): void {
  // write the interpolated varying colour value unchanged into the fragment colour
  samplers[uniforms.sampler].sample(varying.uv[0], varying.uv[1], gl_FragColor);
}

// Draw call
function drawTriangles(fb: FrameBuffer, count: number, vertex: Point[], uv: UV[], uniforms: Uniforms, params: RenderParams) {
  for (let index = 0; index < count * 3; index += 3) {

    const { [index]: vertex1, [index + 1]: vertex2, [index + 2]: vertex3 } = vertex;
    const { [index]: uv1, [index + 1]: uv2, [index + 2]: uv3 } = uv;

    const varying1: Varying = { uv: EMPTY_UV };
    const varying2: Varying = { uv: EMPTY_UV };
    const varying3: Varying = { uv: EMPTY_UV };

    const processedVertex1: Point = [0, 0];
    vertexShader({ vertex: vertex1, uv: uv1 }, uniforms, varying1, processedVertex1);
    const processedVertex2: Point = [0, 0];
    vertexShader({ vertex: vertex2, uv: uv2 }, uniforms, varying2, processedVertex2);
    const processedVertex3: Point = [0, 0];
    vertexShader({ vertex: vertex3, uv: uv3 }, uniforms, varying3, processedVertex3);

    const fragments = rasterizeTriangle(...processedVertex1, ...processedVertex2, ...processedVertex3, 0, 0, fb.width, fb.height);

    const varyingUV: UV[] = [
      varying1.uv, varying2.uv, varying3.uv
    ];

    const gl_FragColor: Colour = [0, 0, 0, 0];

    for (const fragment of fragments) {

      const interpolatedUV = blendBC(fragment.bc, varyingUV) as UV;

      fragmentShader({ uv: interpolatedUV }, uniforms, gl_FragColor);

      fb.setPixel(fragment.position[0], fragment.position[1], gl_FragColor);

    }

  }
}

// Hardware
const fb = new FrameBuffer(1024, 1024);
const samplers: Sampler[] = [new Sampler(), new Sampler()];
const SAMPLER_0 = 0;
const SAMPLER_1 = 1;


//Pixi Batch renderer
const BUFFER_SIZE = 100;
const ENTRIES_PER_TRIANGLE = 3;

const vertexData: Point[] = new Array<Point>(BUFFER_SIZE * ENTRIES_PER_TRIANGLE);
for (let i = 0; i < vertexData.length; i++) {
  vertexData[i] = [0, 0];
}

const uvData: Point[] = new Array<Point>(BUFFER_SIZE * ENTRIES_PER_TRIANGLE);
for (let i = 0; i < uvData.length; i++) {
  uvData[i] = [0, 0];
}

const uniforms: Uniforms = { sampler: SAMPLER_0 };
const params: RenderParams = { blendMode: 'normal' };

let drawCallsPerFrame = 0;

function drawDisplayList(stage: Stage) {
  stage.updateTransform();

  var node: Container;
  var stack: Array<Container>;
  var top: number;

  node = stage;
  stack = new Array<Container>(BUFFER_SIZE);

  stack[0] = node;
  top = 1;

  var indexRun = 0;
  var currentTexture: Texture = null;
  node.iterate((node: DisplayObject) => {
    if (node.visible && node.renderable) {
      var sprite: Sprite = node as Sprite;
      if (sprite.texture.baseTexture != currentTexture || indexRun == BUFFER_SIZE) {
        if (indexRun > 0) {
          // If we have data to draw, flush it to the GPU
          flush(currentTexture, indexRun);
        }
        indexRun = 0;
        currentTexture = sprite.texture.baseTexture;
      }
      // 'draw' the sprite verticies and uvs into the buffers
      sprite.draw(indexRun * ENTRIES_PER_TRIANGLE * 2, vertexData, uvData);
      indexRun++;
    }
  });

  if (indexRun > 0) {
    // any remaining data needs to be flushed
    flush(currentTexture, indexRun);
  }
}

function flush(texture: Texture, count: number) {
  samplers[SAMPLER_0].bind(texture);
  drawTriangles(fb, count * 2, vertexData, uvData, uniforms, params);
  drawCallsPerFrame++;
}

const stage = new Stage();

// Example 1 - Simple displaylist example. 1 Sprite with 1 texture
export async function draw1(screenCtx: CanvasRenderingContext2D | null) {
  const texture = await loadTexture(textureURL);

  const spriteTexture = new SpriteTexture(texture, new Rectangle(0, 0, (1024 / 8) - 1, (1024 / 8) - 1));
  const sprite = new Sprite();
  sprite.texture = spriteTexture;
  sprite.scale.x = sprite.scale.y = 0.5;

  stage.addChild(sprite);

  drawDisplayList(stage);
  fb.write(screenCtx);
  console.log("drawCallsPerFrame", drawCallsPerFrame);
}

// Example 2 - Simple displaylist example. 1 Sprite with 1 texture and 1 child sprite with second texture
export async function draw2(screenCtx: CanvasRenderingContext2D | null) {
  const texture = await loadTexture(textureURL);
  const texture2 = await loadTexture(greenBallonTextureURL);


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

  drawDisplayList(stage);
  fb.write(screenCtx);
  console.log("drawCallsPerFrame", drawCallsPerFrame);
}

export async function draw(screenCtx: CanvasRenderingContext2D | null) {

  const greenBallonSourceTexture = await loadTexture(greenBallonTextureURL);
  const redBallonSourceTexture = await loadTexture(redBallonTextureURL);

  let time = 0;
  let ballons: Sprite[] = [];
  const greenBallonTexture = new SpriteTexture(greenBallonSourceTexture, new Rectangle(0, 0, 105, 156));
  const redBallonTexture = new SpriteTexture(redBallonSourceTexture, new Rectangle(0, 0, 105, 156));

  function tick() {
    fb.clear();

    if (Math.random() > 0.98 && ballons.length < 10) {
      const ballon = new Sprite();
      ballon.texture = Math.random() < 0.5 ? greenBallonTexture:redBallonTexture;
      ballon.position.x = Math.random() * 300;
      ballon.position.y = 300;
      stage.addChild(ballon);
      ballons.push(ballon);
    }

    ballons = ballons.map(ballon => {
      ballon.position.y -= 1;
      ballon.rotation += Math.sin(time / 10) * 0.05;
      // ballon.scale.x += 1 + Math.sin(time / 10) * 0.5;
      if (ballon.position.y < -100) {
        stage.removeChild(ballon);
        return null;
      }
      return ballon;
    }).filter(ballon => ballon !== null);

    drawDisplayList(stage);
    fb.write(screenCtx);
    console.log("drawCallsPerFrame", drawCallsPerFrame);
    drawCallsPerFrame = 0;
    time++;
    requestAnimationFrame(tick);
  }

  tick();

}
