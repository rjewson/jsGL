import { BlendMode, FrameBuffer } from "../lib/FrameBuffer";
import { Sampler } from "../lib/Sampler";
import textureURL from '../assets/texture.png';
import { Point, UV } from "../lib/Types";
import { loadTexture } from "../lib/Texture";
import { Uniforms, RenderParams, drawTriangles, vertexShader, fragmentShader } from "./Lesson-2-2";
import { updateFunctions } from "../utils/Ticker";

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

export async function lesson3_2(screenCtx: CanvasRenderingContext2D, fb: FrameBuffer) {

  // Load the texture
  const texture = await loadTexture(textureURL);
  const sampler: Sampler = new Sampler();
  sampler.bind(texture);
  const uniforms: Uniforms = { sampler };

  // Rendering paramaters
  const params: RenderParams = { blendMode: BlendMode.Normal };

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

  function tick() {
    fb.clear();
    time++;
    scale = Math.sin(time / 100) * 50 + 50;
    angle = time / 100;
    offsetX = Math.sin(time / 100) * 50 + 50;
    offsetY = Math.cos(time / 100) * 50 + 50;
    const newVertex: Point[] = [...modifyVertex(vertex, angle, scale, [offsetX, offsetY])];
    drawTriangles(fb, 2, { vertex: newVertex, uv }, uniforms, vertexShader, fragmentShader, params);

    fb.write(screenCtx);
  }
  
  updateFunctions.push(tick);
  

}