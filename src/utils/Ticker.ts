//Common update loop

interface UpdateFunction {
    (dt: number, step: number): boolean;
}

let updateFunctions: UpdateFunction[] = [];
let prevTime = Date.now();
let step = 0;

function tick() {
    const time = Date.now();
    const dt = time - prevTime;
    step+=dt;
    prevTime = time;
    updateFunctions = updateFunctions.map(fn => {
        if (fn(dt, step)) { 
            return fn;
        }
        return null;
    });
    updateFunctions = updateFunctions.filter(fn => fn !== null);
    requestAnimationFrame(tick);
}

export function onTick(fn: UpdateFunction) {
    updateFunctions.push(fn);
}

export function clearOnTick() {
    updateFunctions = [];
}

tick();