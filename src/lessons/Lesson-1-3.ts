import { DrawingBuffer } from "../lib/DrawingBuffer";
import { Sampler } from "../lib/Sampler";
import { loadTexture } from "../lib/Texture";
import { BarycentricPoint, Colour, Point, UV } from "../lib/Types";
import textureURL from '../assets/texture.png';
import { blendBC, rasterizeTriangle, RenderFn } from "../lib/Rasterizer";

function drawTexturedTriangle(db: DrawingBuffer, vertices: Point[], uvs: UV[], sampler: Sampler) {
    // Colour array to store and pass around
    debugger;
    const interpolatedUV: UV = [0, 0];
    const sampledColour: Colour = [0, 0, 0, 0];
    const fn: RenderFn = (x: number, y: number, bc: BarycentricPoint) => {
        // 1-3 interpolate the cUV
        blendBC(bc, uvs, interpolatedUV) as UV;
        // 1-3 sample the texture with the interpolated UV
        sampler.sample(interpolatedUV[0], interpolatedUV[1], sampledColour);
        // Write the fragment colour to the frame buffer
        db.set(x, y, sampledColour);
    }
    rasterizeTriangle(vertices[0], vertices[1], vertices[2], db.clip.clipTL, db.clip.clipBR, fn);
}

export async function lesson1_3(screenCtx: CanvasRenderingContext2D, db: DrawingBuffer) {

    const triangleVerticies: Point[] = [
        [100, 75], [200, 175], [100, 175]
    ];

    const uvs: UV[] = [
        [0, 0], [0.24, 0.24], [0, 0.24]
        // [0, 0], [0, 1], [1, 1]
    ];

    const texture = await loadTexture(textureURL);
    const sampler = new Sampler();
    sampler.bind(texture);

    drawTexturedTriangle(db, triangleVerticies, uvs, sampler);

    db.write(screenCtx);

}
