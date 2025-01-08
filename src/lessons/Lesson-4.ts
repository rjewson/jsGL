import { FrameBuffer } from "../lib/FrameBuffer";
import { blendBC, rasterizeTriangle } from "../lib/Rasterizer";
import { Sampler } from "../lib/Sampler";
import textureURL from '../texture.png';
import { BarycentricPoint, BLUE, Colour, EMPTY, EMPTY_UV, Fragment, GREEN, Point, RED, UV } from "../lib/Types";
import { loadTexture, Texture } from "../lib/Texture";

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

export type Uniforms = {
  sampler: Sampler;
}

export type RenderParams = {
  blendMode: string;
}

function vertexShader(attributes: Attributes, uniforms: Uniforms, varying: Varying): Point {
  // copy the vertex colour value to a varying
  varying.uv = attributes.uv;
  // return the original vertex position unchanged
  // return attributes.vertex;
  return [Math.floor(attributes.vertex[0]), Math.floor(attributes.vertex[1])];
}

function fragmentShader(varying: Varying, uniforms: Uniforms): Colour {
  // return the interpolated varying colour value unchanged
  const colour = uniforms.sampler.sample(varying.uv[0], varying.uv[1]);
  return colour;
}

export function drawTriangles(fb: FrameBuffer, vertex: Point[], uv: UV[], uniforms: Uniforms, params: RenderParams) {
  for (let index = 0; index < vertex.length; index += 3) {

    const { [index]: vertex1, [index + 1]: vertex2, [index + 2]: vertex3 } = vertex;
    const { [index]: uv1, [index + 1]: uv2, [index + 2]: uv3 } = uv;

    const varying1: Varying = { uv: EMPTY_UV };
    const varying2: Varying = { uv: EMPTY_UV };
    const varying3: Varying = { uv: EMPTY_UV };

    const processedVertex1 = vertexShader({ vertex: vertex1, uv: uv1 }, uniforms, varying1);
    const processedVertex2 = vertexShader({ vertex: vertex2, uv: uv2 }, uniforms, varying2);
    const processedVertex3 = vertexShader({ vertex: vertex3, uv: uv3 }, uniforms, varying3);

    const fragments = rasterizeTriangle(...processedVertex1, ...processedVertex2, ...processedVertex3);

    const varyingUV: UV[] = [
      varying1.uv, varying2.uv, varying3.uv
    ];

    for (const fragment of fragments) {

      const interpolatedUV = blendBC(fragment.bc, varyingUV) as UV;

      const colour = fragmentShader({ uv: interpolatedUV }, uniforms);

      fb.setPixel(fragment.position[0], fragment.position[1], colour[0], colour[1], colour[2], colour[3]);

    }

  }
}

function modifyVertex(vertex: Point[], angle: number, scale: number, offset: Point): Point[] {
  const newVertex: Point[] = [];
  for (const v of vertex) {
    const x = v[0];
    const y = v[1];
    const newX = x * Math.cos(angle) - y * Math.sin(angle);
    const newY = x * Math.sin(angle) + y * Math.cos(angle);
    newVertex.push([newX * scale + offset[0], newY * scale + offset[1]]);
  }
  return newVertex;
}

export async function draw2(screenCtx: CanvasRenderingContext2D | null) {

  // Hardware
  const fb = new FrameBuffer(1024, 1024);
  const sampler = new Sampler();

  // Load the texture
  const texture = await loadTexture(textureURL);

  // Normalized triangle
  const vertex: Point[] = [
    [-1, -1], [-1, 1], [1, 1],
    [-1, -1], [1, 1], [1, -1]
  ];

  // 2x Normalized UVs
  const uv1: UV[] = [
    [0, 0], [0, 0.25], [0.25, 0.25],
    [0, 0], [0.25, 0.25], [0.25, 0]
  ];

  const uv2: UV[] = [
    [0.25, 0.25], [0.25, 0.5], [0.5, 0.5],
    [0.25, 0.25], [0.5, 0.5], [0.5, 0.25]
  ];

  const newVertex: Point[] = [];
  const newUV: UV[] = [];

  // Make 10 random quads
  for (let i = 0; i < 10; i++) {
    // move verticies
    const xOffset = 50 + Math.random() * 200;
    const yOffset = 50 + Math.random() * 200;
    const angle = Math.random() * Math.PI * 2;
    const scale = Math.random() * 50 + 10;

    newVertex.push(...modifyVertex(vertex, angle, scale, [xOffset, yOffset]));
    newUV.push(...(Math.random() > 0.5 ? uv1 : uv2));
  }

  sampler.bind(texture);

  const uniforms: Uniforms = { sampler: sampler };
  const params: RenderParams = { blendMode: 'normal' };

  drawTriangles(fb, newVertex, newUV, uniforms, params);

  fb.write(screenCtx);

}

export async function draw(screenCtx: CanvasRenderingContext2D | null) {
  // Hardware
  const fb = new FrameBuffer(1024, 1024);
  const sampler = new Sampler();

  // Load the texture
  const texture = await loadTexture(textureURL);

  // Normalized triangle
  const vertex: Point[] = [
    [-1, -1], [-1, 1], [1, 1],
    [-1, -1], [1, 1], [1, -1]
  ];

  const uv: UV[] = [
    [0, 0], [0, 0.25], [0.25, 0.25],
    [0, 0], [0.25, 0.25], [0.25, 0]
  ];

  let scale = 1;
  let angle = 0;
  let offsetX = 0;
  let offsetY = 0;
  let time = 0;

  sampler.bind(texture);

  const uniforms: Uniforms = { sampler: sampler };
  const params: RenderParams = { blendMode: 'normal' };

  function render() {
    fb.clear();
    time++;
    scale = Math.sin(time / 100) * 50 + 50; 
    angle = time / 100;
    offsetX = Math.sin(time / 100) * 50 + 50;
    offsetY = Math.cos(time / 100) * 50 + 50;
    const newVertex: Point[] = [...modifyVertex(vertex, angle, scale, [offsetX, offsetY])];
    drawTriangles(fb, newVertex, uv, uniforms, params);
    fb.write(screenCtx);
    window.requestAnimationFrame(render);
  }
  render();
}