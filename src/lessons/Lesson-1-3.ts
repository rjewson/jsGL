import { DrawingBuffer } from "../lib/DrawingBuffer";
import { blendBC, rasterizeTriangle } from "../lib/Rasterizer";
import { Sampler } from "../lib/Sampler";
import { loadTexture } from "../lib/Texture";
import { Colour, Point, UV } from "../lib/Types";
import textureURL from '../assets/texture.png';

function drawTexturedTriangle(db: DrawingBuffer, vertices: Point[], uvs: UV[], sampler: Sampler) {
    const fragments = rasterizeTriangle(vertices[0], vertices[1], vertices[2], db.clip.clipTL, db.clip.clipBR);
    // Colour array to store and pass around
    const sampledColour: Colour = [0, 0, 0, 0];
    for (const fragment of fragments) {
        // 1-3 interpolate the cUV
        const interpolatedUV = blendBC(fragment.bc, uvs) as UV;
        // 1-3 sample the texture with the interpolated UV
        sampler.sample(...interpolatedUV, sampledColour);
        // Write the fragment colour to the frame buffer
        db.set(...fragment.position, sampledColour);
    }
}

export async function lesson1_3(screenCtx: CanvasRenderingContext2D, db: DrawingBuffer) {

    const triangleVerticies: Point[] = [
        [100, 75], [100, 175], [200, 175]
    ];

    const uvs: UV[] = [
        [0, 0], [0, 0.24], [0.24, 0.24]
        // [0, 0], [0, 1], [1, 1]
    ];

    const texture = await loadTexture(textureURL);
    const sampler = new Sampler();
    sampler.bind(texture);

    drawTexturedTriangle(db, triangleVerticies, uvs, sampler);

    db.write(screenCtx);

}
