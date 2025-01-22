import { FrameBuffer } from "../lib/FrameBuffer";
import { rasterizeTriangle } from "../lib/Rasterizer";
import { Colour, Point } from "../lib/Types";

// Examples 1-1 of drawing a single colour triangle

function drawSingleColourTriangle(fb: FrameBuffer, vertices: Point[], colour: Colour) {
    const fragments = rasterizeTriangle(vertices[0], vertices[1], vertices[2], fb.clipTL, fb.clipBR);
    for (const fragment of fragments) {
        // Write the fragment colour to the frame buffer
        fb.setPixel(...fragment.position, colour);
    }
    console.log("Fragment counts = "+fragments.length);
}

export async function lesson1_1(screenCtx: CanvasRenderingContext2D, fb: FrameBuffer) {

    const triangleVerticies: Point[] = [
        [100, 100], [100, 200], [200, 200]
    ];

    const RED: Colour = [255, 0, 0, 255];

    drawSingleColourTriangle(fb, triangleVerticies, RED);

    fb.write(screenCtx);

}
