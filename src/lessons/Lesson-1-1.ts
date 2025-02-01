import { DrawingBuffer } from "../lib/DrawingBuffer";
import { rasterizeTriangle, RenderFn } from "../lib/Rasterizer";
import { BarycentricPoint, Colour, Point } from "../lib/Types";

// Examples 1-1 of drawing a single colour triangle

function drawSingleColourTriangle(db: DrawingBuffer, vertices: Point[], colour: Colour) {
    let fragmentCount = 0;
    const fn: RenderFn = (x: number, y: number, bc: BarycentricPoint) => {
        // Write the fragment colour to the frame buffer
        db.set(x,y, colour);
        fragmentCount++;
    } 
    rasterizeTriangle(vertices[0], vertices[1], vertices[2], db.clip.clipTL, db.clip.clipBR,fn);
    console.log("Fragment counts = "+fragmentCount);
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
