import { RenderFn } from "./Rasterizer";
import { Point } from "./Types";

export function rasterizeTriangle3(v0: Point, v1: Point, v2: Point, clip_p1: Point, clip_p2: Point, fn: RenderFn): void {
    // Sort the points by y-coordinate ascending (p0, p1, p2)
    if (v1[1] < v0[1]) [v0, v1] = [v1, v0];
    if (v2[1] < v0[1]) [v0, v2] = [v2, v0];
    if (v2[1] < v1[1]) [v1, v2] = [v2, v1];

    const edgeFunction = (a: Point, b: Point, c: Point) => (c[0] - a[0]) * (b[1] - a[1]) - (c[1] - a[1]) * (b[0] - a[0]);

    const area = edgeFunction(v0, v1, v2);

    const minX = Math.min(v0[0], v1[0], v2[0]);
    const maxX = Math.max(v0[0], v1[0], v2[0]);
    const minY = Math.min(v0[1], v1[1], v2[1]);
    const maxY = Math.max(v0[1], v1[1], v2[1]);

    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const p: Point = [x, y];
            const w0 = edgeFunction(v1, v2, p);
            const w1 = edgeFunction(v2, v0, p);
            const w2 = edgeFunction(v0, v1, p);

            if (w0 >= 0 && w1 >= 0 && w2 >= 0) {
                const u = w0 / area;
                const v = w1 / area;
                const w = w2 / area;
                fn(x, y, [ u, v, w ]);
            }
        }
    }
}