import { DrawingBuffer } from "../lib/DrawingBuffer";
import { Sampler } from "../lib/Sampler";
import { loadTexture } from "../lib/Texture";
import { BarycentricPoint, Colour, Point, UV } from "../lib/Types";
import textureURL from '../assets/texture.png';
import { blendBC, rasterizeTriangle, RenderFn } from "../lib/Rasterizer";
import { createPane } from "../utils/Options";

function drawTexturedTriangle(db: DrawingBuffer, vertices: Point[], uvs: UV[], sampler: Sampler) {
    // Colour array to store and pass around
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

    // Make it dynamic with tweekpane
    const pane = createPane();
    const lessonOptions = {
        v1: { x: uvs[0][0], y: uvs[0][1] },
        v2: { x: uvs[1][0], y: uvs[1][1] },
        v3: { x: uvs[2][0], y: uvs[2][1] },
    };
    const b0 = pane.addBinding(lessonOptions, 'v1', {
        x: { step: 0.01 },
        y: { min: 0, max: 1 },
    });
    const b1 = pane.addBinding(lessonOptions, 'v2', {
        x: { step: 0.01 },
        y: { min: 0, max: 1 },
    });
    const b2 = pane.addBinding(lessonOptions, 'v3', {
        x: { step: 0.01 },
        y: { min: 0, max: 1 },
    });

    [b0, b1, b2].forEach(b => {
        b.on('change', (_) => {
            uvs[0][0] = lessonOptions.v1.x;
            uvs[0][1] = lessonOptions.v1.y;
            uvs[1][0] = lessonOptions.v2.x;
            uvs[1][1] = lessonOptions.v2.y;
            uvs[2][0] = lessonOptions.v3.x;
            uvs[2][1] = lessonOptions.v3.y;
            drawTexturedTriangle(db, triangleVerticies, uvs, sampler);
            db.write(screenCtx);
        });
    });
    // end tweekpane

    drawTexturedTriangle(db, triangleVerticies, uvs, sampler);

    db.write(screenCtx);

}
