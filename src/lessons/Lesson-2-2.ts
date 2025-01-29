import { BlendMode, DrawingBuffer } from "../lib/DrawingBuffer";
import { blendBC, rasterizeTriangle } from "../lib/Rasterizer";
import { Sampler, SamplerIndex } from "../lib/Sampler";
import textureURL from '../assets/texture.png';
import { Colour, EMPTY_UV, Point, UV } from "../lib/Types";
import { loadTexture } from "../lib/Texture";

export type Buffers = {
  vertex: Point[];
  uv: UV[];
}

export type Attributes = {
  vertex: Point;
  uv: Point;
}

export type Varying = {
  uv: UV;
}

export type Uniforms = {
  sampler: Sampler;
}

export type RenderParams = {
  blendMode: BlendMode;
}

export type VertexShader = (arg0: Attributes, arg1: Uniforms, arg2: Varying, arg3: Point) => void;
export type FragmentShader = (arg0: Varying, arg1: Uniforms, arg3: Colour) => void;

export function vertexShader(attributes: Attributes, uniforms: Uniforms, varying: Varying, gl_Position: Point): void {
  // copy the vertex colour value to a varying
  varying.uv = attributes.uv;
  // return the original vertex position unchanged
  // return attributes.vertex;
  gl_Position[0] = Math.floor(attributes.vertex[0]);
  gl_Position[1] = Math.floor(attributes.vertex[1]);
}

export function fragmentShader(varying: Varying, uniforms: Uniforms, gl_FragColor: Colour): void {
  // write the interpolated varying colour value unchanged into the fragment colour
  uniforms.sampler.sample(varying.uv[0], varying.uv[1], gl_FragColor);
}

// Draw call to WebGL
// Final version, will be used in all future lessons
// Note that this is very specific to the single use case of texture triangles
export function drawTriangles(
  fb: DrawingBuffer,
  count: number,
  buffers: Buffers,
  uniforms: Uniforms,
  vertexShader: VertexShader,
  fragmentShader: FragmentShader,
  params: RenderParams) 
{
  // Set the 'webgl' params
  fb.blendMode(params.blendMode);

  // The buffers have to be uploaded from CPU side to GPU side
  const { vertex, uv } = buffers;

  // Everything below here is executed on the GPU
  for (let index = 0; index < count * 3; index += 3) {

    // Extract the 3 vertex attributes from buffer
    const { [index]: vertex1, [index + 1]: vertex2, [index + 2]: vertex3 } = vertex;
    // Extract the 3 uv attributes from buffer
    const { [index]: uv1, [index + 1]: uv2, [index + 2]: uv3 } = uv;

    // Create the varying data structure for each vertex shader
    const varying1: Varying = { uv: EMPTY_UV };
    const varying2: Varying = { uv: EMPTY_UV };
    const varying3: Varying = { uv: EMPTY_UV };

    const processedVertex1: Point = [0, 0];
    vertexShader({ vertex: vertex1, uv: uv1 }, uniforms, varying1, processedVertex1);
    const processedVertex2: Point = [0, 0];
    vertexShader({ vertex: vertex2, uv: uv2 }, uniforms, varying2, processedVertex2);
    const processedVertex3: Point = [0, 0];
    vertexShader({ vertex: vertex3, uv: uv3 }, uniforms, varying3, processedVertex3);

    const fragments = rasterizeTriangle(processedVertex1, processedVertex2, processedVertex3, fb.clip.clipTL, fb.clip.clipBR);


    const varyingUV: UV[] = [
      varying1.uv, varying2.uv, varying3.uv
    ];

    const gl_FragColor: Colour = [0, 0, 0, 0];
    const fragmentVarying = { uv: [0, 0] as UV };

    for (const fragment of fragments) {

      blendBC(fragment.bc, varyingUV, fragmentVarying.uv) as UV;

      fragmentShader(fragmentVarying, uniforms, gl_FragColor);

      fb.set(fragment.position[0], fragment.position[1], gl_FragColor);

    }
  }
}

export async function lesson2_2(screenCtx: CanvasRenderingContext2D, db: DrawingBuffer) {

  // 2 triangles
  const vertex: Point[] = [
    [50, 50], [50, 150], [150, 150],
    [50, 50], [150, 150], [150, 50]
  ];

  const uv: UV[] = [
    [0, 0], [0, 0.24], [0.24, 0.24],
    [0, 0], [0.24, 0.24], [0.24, 0]
  ];

  // Load texture
  const texture = await loadTexture(textureURL);

  // Create sampler and bind texture, add sampler to uniforms
  const sampler: Sampler = new Sampler();
  sampler.bind(texture);
  const uniforms: Uniforms = { sampler };

  // Rendering paramaters
  const params: RenderParams = { blendMode: BlendMode.Normal };

  // Draw call
  drawTriangles(db, 2, { vertex, uv }, uniforms, vertexShader, fragmentShader, params);

  db.write(screenCtx);

}
