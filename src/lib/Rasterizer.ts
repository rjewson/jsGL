import { Fragment, BarycentricPoint } from "./Types";

function f_ab(x: number, y: number, pax: number, pay: number, pbx: number, pby: number): number {
    return (pay - pby) * x + (pbx - pax) * y + pax * pby - pbx * pay;
}

export function rasterizeTriangle(p1x: number, p1y: number, p2x: number, p2y: number, p3x: number, p3y: number): Fragment[] {
    const fragments: Fragment[] = [];
    const bbox = {
        top: { x: Math.min(p1x, p2x, p3x), y: Math.min(p1y, p2y, p3y) },
        right: { x: Math.max(p1x, p2x, p3x), y: Math.max(p1y, p2y, p3y) }
    };
    let x: number, y: number;
    for (y = bbox.top.y; y <= bbox.right.y; y++) {
        let scanning = false
        for (x = bbox.top.x; x <= bbox.right.x; x++) {
            const alpha = f_ab(x, y, p2x, p2y, p3x, p3y) / f_ab(p1x, p1y, p2x, p2y, p3x, p3y);
            const theta = f_ab(x, y, p3x, p3y, p1x, p1y) / f_ab(p2x, p2y, p3x, p3y, p1x, p1y);
            const gamma = f_ab(x, y, p1x, p1y, p2x, p2y) / f_ab(p3x, p3y, p1x, p1y, p2x, p2y);
            if (
                alpha >= 0 &&
                alpha <= 1 &&
                theta >= 0 &&
                theta <= 1 &&
                gamma >= 0 &&
                gamma <= 1
            ) {
                fragments.push({
                    position: [x, y],
                    bc: [alpha, theta, gamma]
                });
                scanning = true;
            } else if (scanning) {
                break;
            }
        }
    }
    return fragments;
}

export function blendBC(bc: BarycentricPoint, data: number[][]): number[] {
    const [alpha, theta, gamma] = bc;
    const result = [];
    const count = data[0].length
    for (let i = 0; i < count; i++) {
        result.push(alpha * data[0][i] + theta * data[1][i] + gamma * data[2][i]);
    }
    return result;
}
