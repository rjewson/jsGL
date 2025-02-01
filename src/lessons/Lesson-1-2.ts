import { DrawingBuffer } from "../lib/DrawingBuffer";
import { blendBC, rasterizeTriangle, RenderFn } from "../lib/Rasterizer";
import { BarycentricPoint, BLUE, Colour, GREEN, Point, RED } from "../lib/Types";
import { createPane } from "../utils/Options";

// Examples 1-2 of drawing a single multi colour triangle

function drawMultiColourTriangle(db: DrawingBuffer, vertices: Point[], colours: Colour[]) {
    const fn: RenderFn = (x: number, y: number, bc: BarycentricPoint) => {
        // 1-2 interpolate the colour
        const interpolatedColour = blendBC(bc, colours, [0, 0, 0, 0]) as Colour;
        // Write the fragment colour to the frame buffer
        db.set(x, y, interpolatedColour);
    }
    rasterizeTriangle(vertices[0], vertices[1], vertices[2], db.clip.clipTL, db.clip.clipBR, fn);
}

export async function lesson1_2(screenCtx: CanvasRenderingContext2D, db: DrawingBuffer) {

    const triangleVerticies: Point[] = [
        [100, 75], [100, 175], [200, 175]
    ];

    const colours: Colour[] = [
        RED, GREEN, BLUE
    ];

    // Make it dynamic with tweekpane
    const pane = createPane();
    const lessonOptions = {
        v1: { r: colours[0][0], g: colours[0][1], b: colours[0][2] },
        v2: { r: colours[1][0], g: colours[1][1], b: colours[1][2] },
        v3: { r: colours[2][0], g: colours[2][1], b: colours[2][2] },
    };
    const b0 = pane.addBinding(lessonOptions, 'v1');
    const b1 = pane.addBinding(lessonOptions, 'v2');
    const b2 = pane.addBinding(lessonOptions, 'v3');

    [b0, b1, b2].forEach(b => {
        b.on('change', (_) => {
            colours[0] = [lessonOptions.v1.r, lessonOptions.v1.g, lessonOptions.v1.b, 255];
            colours[1] = [lessonOptions.v2.r, lessonOptions.v2.g, lessonOptions.v2.b, 255];
            colours[2] = [lessonOptions.v3.r, lessonOptions.v3.g, lessonOptions.v3.b, 255];
            drawMultiColourTriangle(db, triangleVerticies, colours);
            db.write(screenCtx);
        });
    });
    // end tweekpane

    drawMultiColourTriangle(db, triangleVerticies, colours);
    db.write(screenCtx);

}
