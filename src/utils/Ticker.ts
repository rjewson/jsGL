//Common update loop
let time = 0;
interface UpdateFunction {
    (time: number): void;
}

export const updateFunctions: UpdateFunction[] = [];

function tick() {
    time++
    updateFunctions.forEach(fn => fn(time));
    requestAnimationFrame(tick);
}

tick();