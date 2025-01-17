import { Container } from "./Container";

export class Stage extends Container {
    constructor() {
        super();
        this.id = "Stage";
        this.worldAlpha = this.alpha;
    }

    public updateTransform() {
        for (const child of this.children) { 
            child.updateTransform();
        }     
    }
}