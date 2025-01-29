import { DrawingBuffer } from "../lib/DrawingBuffer";
import { rasterizeTriangle } from "../lib/Rasterizer";
import { Colour, Point } from "../lib/Types";

// Examples 1-1 of drawing a single colour triangle

function drawSingleColourTriangle(db: DrawingBuffer, vertices: Point[], colour: Colour) {
    const fragments = rasterizeTriangle(vertices[0], vertices[1], vertices[2], db.clip.clipTL, db.clip.clipBR);
    for (const fragment of fragments) {
        // Write the fragment colour to the frame buffer
        db.set(...fragment.position, colour);
    } 
    console.log("Fragment counts = "+fragments.length);
}

export async function lesson1_1(screenCtx: CanvasRenderingContext2D, db: DrawingBuffer) {

    console.log("%cSimple example to draw a single colour triangle", "color: blue;");

    const triangleVerticies: Point[] = [
        [100, 75], [100, 175], [200, 175]
    ];

    const RED: Colour = [255, 0, 0, 255];

    drawSingleColourTriangle(db, triangleVerticies, RED);

    db.write(screenCtx);

}
