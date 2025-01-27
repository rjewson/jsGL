import { FrameBuffer } from "../lib/FrameBuffer";
import { blendBC, rasterizeTriangle } from "../lib/Rasterizer";
import { BLUE, Colour, GREEN, Point, RED } from "../lib/Types";

// Examples 1-2 of drawing a single multi colour triangle

function drawMultiColourTriangle(fb: FrameBuffer, vertices: Point[], colours: Colour[]) {
    const fragments = rasterizeTriangle(vertices[0], vertices[1], vertices[2], fb.clip.clipTL, fb.clip.clipBR);
    for (const fragment of fragments) {
        // 1-2 interpolate the colour
        const interpolatedColour = blendBC(fragment.bc, colours) as Colour;
        // Write the fragment colour to the frame buffer
        fb.set(...fragment.position, interpolatedColour);
    }
}

export async function lesson1_2(screenCtx: CanvasRenderingContext2D, fb: FrameBuffer) {

    const triangleVerticies: Point[] = [
        [100, 75], [100, 175], [200, 175]
    ];

    const singleColour: Colour[] = [
        GREEN, GREEN, GREEN
    ];

    const multiColour: Colour[] = [
        RED, GREEN, BLUE
    ];

    drawMultiColourTriangle(fb, triangleVerticies, multiColour);

    fb.write(screenCtx);

}
