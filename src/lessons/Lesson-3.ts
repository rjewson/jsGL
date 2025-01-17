import { FrameBuffer } from "../lib/FrameBuffer";
import { blendBC, rasterizeTriangle } from "../lib/Rasterizer";
import { Sampler } from "../lib/Sampler";
import textureURL from '../assets/texture.png';
import { BarycentricPoint, BLUE, Colour, EMPTY, EMPTY_UV, Fragment, GREEN, Point, RED, UV } from "../lib/Types";
import { loadTexture } from "../lib/Texture";

// Create the frame buffer to draw to
const fb = new FrameBuffer(1024, 1024);

// Convert the triangle to a list of fragments

// 2 triangles
const vertex: Point[] = [
  [50, 50], [50, 150], [150, 150],
  [50, 50], [150, 150], [150, 50]
];

const uv: UV[] = [
  [0, 0], [0, 0.25], [0.25, 0.25],
  [0, 0], [0.25, 0.25], [0.25, 0]
];

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
  sampler: Sampler;
}

function vertexShader(attributes: Attributes, uniforms: Uniforms, varying: Varying): Point {
  // copy the vertex colour value to a varying
  varying.uv = attributes.uv;
  // return the original vertex position unchanged
  return attributes.vertex;
}

function fragmentShader(varying: Varying, uniforms: Uniforms): Colour {
  // return the interpolated varying colour value unchanged
  const sampledColour: Colour = [0, 0, 0, 0];
  uniforms.sampler.sample(...varying.uv, sampledColour);
  return sampledColour;
}

function drawTriangles(vertex: Point[], uv: UV[], uniforms: Uniforms) {
  for (let index = 0; index < vertex.length; index += 3) {

    const { [index]: vertex1, [index + 1]: vertex2, [index + 2]: vertex3 } = vertex;
    const { [index]: uv1, [index + 1]: uv2, [index + 2]: uv3 } = uv;

    const varying1: Varying = { uv: EMPTY_UV };
    const varying2: Varying = { uv: EMPTY_UV };
    const varying3: Varying = { uv: EMPTY_UV };

    const processedVertex1 = vertexShader({ vertex: vertex1, uv: uv1 }, uniforms, varying1);
    const processedVertex2 = vertexShader({ vertex: vertex2, uv: uv2 }, uniforms, varying2);
    const processedVertex3 = vertexShader({ vertex: vertex3, uv: uv3 }, uniforms, varying3);

    const fragments = rasterizeTriangle(...processedVertex1, ...processedVertex2, ...processedVertex3, 0, 0, fb.width, fb.height);

    const varyingUV: UV[] = [
      varying1.uv, varying2.uv, varying3.uv
    ];

    for (const fragment of fragments) {
      const interpolatedUV = blendBC(fragment.bc, varyingUV) as UV;

      const colour = fragmentShader({ uv: interpolatedUV }, uniforms);

      fb.setPixel(...fragment.position, colour);
    }

  }
}

export async function draw(screenCtx: CanvasRenderingContext2D) {
  const texture = await loadTexture(textureURL);
  const sampler = new Sampler();
  sampler.bind(texture);
  drawTriangles(vertex, uv, { sampler: sampler });
  fb.write(screenCtx);
}
