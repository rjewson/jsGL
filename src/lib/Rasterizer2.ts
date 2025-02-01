import { RenderFn } from "./Rasterizer";
import { Point, Fragment, BarycentricPoint } from "./Types";

function orient2d(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): number {
    return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
}

export function rasterizeTriangle2(v0: Point, v1: Point, v2: Point, clip_p1: Point, clip_p2: Point, fn: RenderFn): void {

    // if (v1[1] < v0[1]) [v0, v1] = [v1, v0];
    // if (v2[1] < v0[1]) [v0, v2] = [v2, v0];
    // if (v2[1] < v1[1]) [v1, v2] = [v2, v1];

    [v0, v1] = [v1, v0];

    const v0x: number = v0[0];
    const v0y: number = v0[1];
    const v1x: number = v1[0];
    const v1y: number = v1[1];
    const v2x: number = v2[0];
    const v2y: number = v2[1];

    const minX = Math.floor(Math.max(Math.min(v0x, v1x, v2x), clip_p1[0]));
    const minY = Math.floor(Math.max(Math.min(v0y, v1y, v2y), clip_p1[1]));
    const maxX = Math.ceil(Math.min(Math.max(v0x, v1x, v2x), clip_p2[0]));
    const maxY = Math.ceil(Math.min(Math.max(v0y, v1y, v2y), clip_p2[1]));

    let A01 = v0y - v1y;
    let B01 = v1x - v0x;
    let A12 = v1y - v2y;
    let B12 = v2x - v1x;
    let A20 = v2y - v0y;
    let B20 = v0x - v2x;

    // // Barycentric coordinates at minX/minY corner
    // const p = [minX, minY };
    let area = orient2d(v0x,v0y, v1x,v1y, v2x,v2y);
    let w0_row = orient2d(v1x, v1y, v2x, v2y, minX, minY);
    let w1_row = orient2d(v2x, v2y, v0x, v0y, minX, minY);
    let w2_row = orient2d(v0x, v0y, v1x, v1y, minX, minY);

    const bc: BarycentricPoint = [0, 0, 0];

    let x: number, y: number;
    for (y = minY; y <= maxY; y++) {
        // Barycentric coordinates at start of row
        let w0 = w0_row;
        let w1 = w1_row;
        let w2 = w2_row;

        for (x = minX; x <= maxX; x++) {
            // If p is on or inside all edges, render pixel.
            if (w0 >= 0 && w1 >= 0 && w2 >= 0) {
                // renderPixel(p, w0, w1, w2);
                bc[0] = w0/area;
                bc[1] = w1/area;
                bc[2] = w2/area;
                fn(x, y, bc);
            }

            // One step to the right
            w0 += A12;
            w1 += A20;
            w2 += A01;
        }
        // One row step
        w0_row += B12;
        w1_row += B20;
        w2_row += B01;
    }
}