import { FrameBuffer } from "../lib/FrameBuffer";
import { blendBC, rasterizeTriangle } from "../lib/Rasterizer";
import { Sampler } from "../lib/Sampler";
import textureURL from '../assets/texture.png';
import { BarycentricPoint, BLUE, Colour, EMPTY, Fragment, GREEN, Point, RED, UV } from "../lib/Types";

// Create the frame buffer to draw to
const fb = new FrameBuffer(1024, 1024);

// Convert the triangle to a list of fragments

// 2 triangles
const vertex: Point[] = [
  [50, 50], [50, 150], [150, 150],
  [200, 50], [200, 100], [250, 100]
];

const colour: Colour[] = [
  RED, GREEN, BLUE,
  BLUE, GREEN, BLUE
];

type Buffers = {
  vertex: Point[];
  colour: Colour[];
}

type Attributes = {
  vertex: Point;
  colour: Colour;
}

type Varying = {
  colour: Colour;
}

type Uniforms = {
}

const uniforms: Uniforms = {};

function vertexShader(attributes: Attributes, uniforms: Uniforms, varying: Varying): Point {
  // copy the vertex colour value to a varying
  varying.colour = attributes.colour;
  // return the original vertex position unchanged
  return attributes.vertex;
}

function fragmentShader(varying: Varying, uniforms: Uniforms): Colour {
  // return the interpolated varying colour value unchanged
  return varying.colour;
}

function drawTriangles() {
  for (let index = 0; index < vertex.length; index += 3) {

    const { [index]: vertex1, [index + 1]: vertex2, [index + 2]: vertex3 } = vertex;
    const { [index]: colour1, [index + 1]: colour2, [index + 2]: colour3 } = colour;

    const varying1: Varying = { colour: EMPTY };
    const varying2: Varying = { colour: EMPTY };
    const varying3: Varying = { colour: EMPTY };

    const processedVertex1 = vertexShader({ vertex: vertex1, colour: colour1 }, uniforms, varying1);
    const processedVertex2 = vertexShader({ vertex: vertex2, colour: colour2 }, uniforms, varying2);
    const processedVertex3 = vertexShader({ vertex: vertex3, colour: colour3 }, uniforms, varying3);

    const fragments = rasterizeTriangle(...processedVertex1, ...processedVertex2, ...processedVertex3, 0, 0, fb.width, fb.height);

    const varyingColour: Colour[] = [
      varying1.colour, varying2.colour, varying3.colour
    ];

    for (const fragment of fragments) {
      const interpolatedColour = blendBC(fragment.bc, varyingColour) as Colour;

      const colour = fragmentShader({ colour: interpolatedColour }, uniforms);

      fb.setPixel(...fragment.position, colour);
    }

  }
}

export async function draw(screenCtx: CanvasRenderingContext2D) {
  drawTriangles();
  fb.write(screenCtx);
}
