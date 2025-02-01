import { Fragment, BarycentricPoint, Point } from "./Types";

function f_ab(x: number, y: number, pax: number, pay: number, pbx: number, pby: number): number {
    return (pay - pby) * x + (pbx - pax) * y + pax * pby - pbx * pay;
}

export type RenderFn = (x: number, y: number, bc: BarycentricPoint) => void;

export function rasterizeTriangle(p1: Point, p2: Point, p3: Point, clip_p1: Point, clip_p2: Point, fn: RenderFn): void {

    const p1x: number = p1[0];
    const p1y: number = p1[1];
    const p2x: number = p2[0];
    const p2y: number = p2[1];
    const p3x: number = p3[0];
    const p3y: number = p3[1];

    const bbox_top_x = Math.floor(Math.max(Math.min(p1x, p2x, p3x), clip_p1[0]));
    const bbox_top_y = Math.floor(Math.max(Math.min(p1y, p2y, p3y), clip_p1[1]));
    const bbox_right_x = Math.ceil(Math.min(Math.max(p1x, p2x, p3x), clip_p2[0]));
    const bbox_right_y = Math.ceil(Math.min(Math.max(p1y, p2y, p3y), clip_p2[1]));
    let x: number, y: number;

    const bc: BarycentricPoint = [0, 0, 0];
    const alphaDiv = f_ab(p1x, p1y, p2x, p2y, p3x, p3y);
    const thetaDiv = f_ab(p2x, p2y, p3x, p3y, p1x, p1y);
    const gammaDiv = f_ab(p3x, p3y, p1x, p1y, p2x, p2y);

    for (y = bbox_top_y; y <= bbox_right_y; y++) {
        let scanning = false
        for (x = bbox_top_x; x <= bbox_right_x; x++) {
            const alpha = f_ab(x, y, p2x, p2y, p3x, p3y) / alphaDiv;
            // if (alpha < 0 || alpha > 1) continue;
            const theta = f_ab(x, y, p3x, p3y, p1x, p1y) / thetaDiv;
            // if (theta < 0 || theta > 1) continue;
            const gamma = f_ab(x, y, p1x, p1y, p2x, p2y) / gammaDiv;
            // if (gamma < 0 || gamma > 1) continue;

            // bc[0] = alpha;
            // bc[1] = theta;
            // bc[2] = gamma;
            // fn(x, y, bc);
            // scanning = true;

            if (
                alpha >= 0 &&
                alpha <= 1 &&
                theta >= 0 &&
                theta <= 1 &&
                gamma >= 0 &&
                gamma <= 1
            ) {
                bc[0] = alpha;
                bc[1] = theta;
                bc[2] = gamma;
                fn(x, y, bc);
                scanning = true;
            } else if (scanning) {
                break;
            }
        }
    }
}

export function blendBC(bc: BarycentricPoint, data: number[][], result: number[]): number[] {
    const count = data[0].length;
    for (let i = 0; i < count; i++) {
        result[i] = (bc[0] * data[0][i] + bc[1] * data[1][i] + bc[2] * data[2][i]);
    }
    return result;
}

// export function blendBC(bc: BarycentricPoint, data: number[][]): number[] {
//     const [alpha, theta, gamma] = bc;
//     const result = [];
//     const count = data[0].length;
//     for (let i = 0; i < count; i++) {
//         result.push(alpha * data[0][i] + theta * data[1][i] + gamma * data[2][i]);
//     }
//     return result;
// }

