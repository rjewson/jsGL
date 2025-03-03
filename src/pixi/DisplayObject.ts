import { Point } from "../lib/Types";
import { Container } from "./Container";
import { CreateMat3 } from "./utils";
import { Vector2 } from "./Vector2";

export class DisplayObject {

    public id: string;

    public position: Vector2;
    public scale: Vector2;
    public pivot: Vector2;
    
    public visible: boolean;
    public renderable: boolean;
    
    public alpha: number;
    public worldAlpha: number;

    public clip: Point;
    
    public worldTransform: Float32Array;
    public localTransform: Float32Array;
    
    public parent: Container;
    
    protected _rotation: number;
    protected _rotationComponents: Vector2;

    constructor() {
        this.position = new Vector2();
        this.scale = new Vector2(1, 1);
        this.pivot = new Vector2();
        this.alpha = 1;
        this.visible = true;
        this.renderable = false;
        this.parent = null;
        this.clip = null;
        this.worldTransform = CreateMat3();
        this.localTransform = CreateMat3();
        this._rotationComponents = new Vector2();
        this.rotation = 0;
    }

    get rotation(): number {
        return this._rotation;
    }

    set rotation(v: number) {
        this._rotation = v;
        this._rotationComponents.x = Math.cos(this._rotation);
        this._rotationComponents.y = Math.sin(this._rotation);
    }

    public RoundFunction(v: number): number {
        return v;
    }

    public updateTransform() {}

    public calcExtents() {}

    public iterate(cb:any) {
        cb(this);
    }
}