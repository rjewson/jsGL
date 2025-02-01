import { DrawingBuffer } from "../lib/DrawingBuffer";
import { blendBC, rasterizeTriangle, RenderFn } from "../lib/Rasterizer";
import { Sampler } from "../lib/Sampler";
import { loadTexture } from "../lib/Texture";
import { BarycentricPoint, Colour, Point, UV } from "../lib/Types";
import textureURL from '../assets/texture.png';

type Uniforms = {
    sampler: Sampler;
}

type VertexShader = (arg0: Point, arg1: UV, arg2: Uniforms, arg3: Point) => void;
type FragmentShader = (arg0: UV, arg1: Uniforms, arg3: Colour) => void;

function vertexShader(vertex: Point, uv: Point, uniforms: Uniforms, gl_Position: Point) {
    gl_Position[0] = Math.floor(vertex[0]);
    gl_Position[1] = Math.floor(vertex[1]);
}

function fragmentShader(interpolatedUV: UV, uniforms: Uniforms, gl_FragColor: Colour) {
    uniforms.sampler.sample(...interpolatedUV, gl_FragColor);
}

function drawTexturedTriangle(
    fb: DrawingBuffer,
    count: number,
    vertices: Point[],
    uvs: UV[],
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    uniforms: Uniforms) {

    for (let index = 0; index < count * 3; index += 3) {

        // Extract the 3 vertex attributes from buffer
        const { [index]: vertex1, [index + 1]: vertex2, [index + 2]: vertex3 } = vertices;
        // Extract the 3 uv attributes from buffer
        const { [index]: uv1, [index + 1]: uv2, [index + 2]: uv3 } = uvs;

        // Call the vertex shader for each vertex in the triangle
        const processedVertex1: Point = [0, 0];
        vertexShader(vertex1, uv1, uniforms, processedVertex1);
        const processedVertex2: Point = [0, 0];
        vertexShader(vertex2, uv2, uniforms, processedVertex2);
        const processedVertex3: Point = [0, 0];
        vertexShader(vertex3, uv3, uniforms, processedVertex3);

        const uvsForBlending = [uv1, uv2, uv3];

        // Colour array to store and pass around
        const interpolatedUV: UV = [0, 0];
        const gl_FragColor: Colour = [0, 0, 0, 0];

        const fn: RenderFn = (x: number, y: number, bc: BarycentricPoint) => {
            blendBC(bc, uvsForBlending, interpolatedUV) as UV;
            // Call the fragment shader for each fragement
            fragmentShader(interpolatedUV, uniforms, gl_FragColor)
            fb.set(x, y, gl_FragColor);
        }
        rasterizeTriangle(processedVertex1, processedVertex2, processedVertex3, fb.clip.clipTL, fb.clip.clipBR, fn);
    }
}

export async function lesson2_1(screenCtx: CanvasRenderingContext2D, db: DrawingBuffer) {

    const vertex: Point[] = [
        [50, 50], [50, 150], [150, 150],
        [60, 50], [160, 150], [160, 50]
    ];

    const uv: UV[] = [
        [0, 0], [0, 0.24], [0.24, 0.24],
        [0, 0], [0.24, 0.24], [0.24, 0]
    ];

    const texture = await loadTexture(textureURL);
    const sampler = new Sampler();
    sampler.bind(texture);

    drawTexturedTriangle(db, 2, vertex, uv, vertexShader, fragmentShader, { sampler });

    db.write(screenCtx);

}
