import { FrameBuffer } from "../lib/FrameBuffer";
import { blendBC, rasterizeTriangle } from "../lib/Rasterizer";
import { Sampler } from "../lib/Sampler";
import textureURL from '../texture.png';
import { BarycentricPoint, BLUE, Colour, Fragment, GREEN, Point, RED, UV } from "../lib/Types";
import { loadTexture } from "../lib/Texture";

// Create the frame buffer to draw to
const fb = new FrameBuffer(1024, 1024);

// Convert the triangle to a list of fragments

const triangle: Point[] = [
  [100, 100], [100, 200], [200, 200]
];

const fragments = rasterizeTriangle(...triangle[0], ...triangle[1], ...triangle[2]);

// Examples 1 of drawing a single colour triangle

function drawSingleColourTriangle() {
  for (const fragment of fragments) {
    fb.setPixel(...fragment.position, ...RED);
  }
}

// Examples 2 of drawing a multi-colour triangle

const colours: Colour[] = [
  RED, GREEN, BLUE
];

function drawColourTriangle() {
  for (const fragment of fragments) {
    const interpolatedColour = blendBC(fragment.bc, colours) as Colour;
    fb.setPixel(...fragment.position, ...interpolatedColour);
  }
}

// Examples 3 of drawing a textured triangle

const uvs: UV[] = [
  [0, 0], [0, 0.2], [0.2, 0.2]
];

function drawTextureTriangle(sampler: Sampler) {
  for (const fragment of fragments) {
    const uv = blendBC(fragment.bc, uvs) as UV;
    const sampledColour = sampler.sample(...uv);
    fb.setPixel(...fragment.position, ...sampledColour);
  }
}

export async function draw(screenCtx) {
  // drawSingleColourTriangle();
  // drawColourTriangle();
  const texture = await loadTexture(textureURL);
  const sampler = new Sampler();
  sampler.bind(texture);
  drawTextureTriangle(sampler);
  
  fb.write(screenCtx);
}
