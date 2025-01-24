import { Pane } from "tweakpane";

let pane:Pane = null;

export function createPane(): Pane {
    disposePane();
    pane = new Pane();
    return pane;
}

export function disposePane() {
    if (pane) {
        pane.dispose();
        pane = null;
    }
}
