import { BlendMode, FrameBuffer } from "../lib/FrameBuffer";
import { Sampler } from "../lib/Sampler";
import textureURL from '../assets/texture.png';
import { Point, UV } from "../lib/Types";
import { loadTexture } from "../lib/Texture";
import { Uniforms, RenderParams, drawTriangles, vertexShader, fragmentShader } from "./Lesson-2-2";

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

export async function lesson3_1(screenCtx: CanvasRenderingContext2D, fb: FrameBuffer) {

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

  const count = 10;

  // Make 10 random quads
  for (let i = 0; i < count; i++) {
    // move verticies
    const xOffset = 50 + Math.random() * 200;
    const yOffset = 50 + Math.random() * 200;
    const angle = Math.random() * Math.PI * 2;
    const scale = Math.random() * 50 + 10;

    newVertex.push(...modifyVertex(vertex, angle, scale, [xOffset, yOffset]));
    newUV.push(...(Math.random() > 0.5 ? uv1 : uv2));
  }

  const sampler: Sampler = new Sampler();
  sampler.bind(texture);
  const uniforms: Uniforms = { sampler };

  const params: RenderParams = { blendMode: BlendMode.Normal };

  drawTriangles(fb, count*2, { vertex: newVertex, uv: newUV }, uniforms, vertexShader, fragmentShader, params);

  fb.write(screenCtx);

}
