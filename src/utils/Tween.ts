import { Point } from "../lib/Types";
import { onTick } from "./Ticker";

export type TweenTarget = { [key: string]: any };
export type EasingFunction = (t: number) => number;

export function easeOutQuad(t: number) {
    return t * (2 - t);
}

export function easeOutBack(t: number) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function easeOutBounce(t: number) {
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375 : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
}

export type TweenConfig = {
    target: { [key: string]: any },
    prop: string,
    start: Point,
    end: Point,
    time: number,
    easing: EasingFunction
};

export function tween(target: { [key: string]: any }, property: string, targetValue: number, duration: number, easing: (t: number) => number) {
    let resolve: (value: unknown) => void = null;
    const result = new Promise((r) => resolve = r);
    const startValue = target[property];
    const startTime = Date.now();
    const update = (dt: number) => {
        const now = Date.now();
        const t = Math.min(1, (now - startTime) / duration);
        target[property] = startValue + (targetValue - startValue) * easing(t);
        if (t < 1) {
            return true;
        }
        target[property] = targetValue;
        resolve(true);
        return false;
    }
    onTick(update);
    return result;
}