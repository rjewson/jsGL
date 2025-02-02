import { BlendMode } from "../lib/DrawingBuffer";
import { Point } from "../lib/Types";
import { Container } from "./Container";
import { SpriteTexture } from "./SpriteTexture";
import { Vector2 } from "./utils";

export class Sprite extends Container {

    public anchor: Vector2;
    public texture: SpriteTexture;
    public blendMode: BlendMode;

    public transformedVerts: Float32Array;

    constructor() {
        super();
        this.renderable = true;
        this.anchor = new Vector2();
        this.transformedVerts = new Float32Array(8);
        this.blendMode = BlendMode.Normal;
    }

    public draw(index:number, vertexData: Point[], uvData: Point[]) {
        const width = this.texture.frame.width;
        const height = this.texture.frame.height;

        const aX = this.anchor.x;
        const aY = this.anchor.y;
        const w0 = width * (1 - aX);
        const w1 = width * -aX;

        const h0 = height * (1 - aY);
        const h1 = height * -aY;

        const a = this.worldTransform[0];
        const b = this.worldTransform[3];
        const c = this.worldTransform[1];
        const d = this.worldTransform[4];
        const tx = this.worldTransform[2];
        const ty = this.worldTransform[5];

        const uvs = this.texture.uvs;

        //0 TL
        //Verts
        vertexData[index][0] = a * w1 + c * h1 + tx;
        vertexData[index][1] = d * h1 + b * w1 + ty;
        //UV
        uvData[index][0] = uvs[0]; //frame.x / tw;
        uvData[index][1] = uvs[1]; //frame.y / th;
        
        //1 BR
        //Verts
        vertexData[index + 1][0] = a * w0 + c * h0 + tx;
        vertexData[index + 1][1] = d * h0 + b * w0 + ty;
        //UV
        uvData[index + 1][0] = uvs[4]; //(frame.x + frame.width) / tw;
        uvData[index + 1][1] = uvs[5]; //(frame.y + frame.height) / th;
        
        //2 BL
        //Verts
        vertexData[index + 2][0] = a * w1 + c * h0 + tx;
        vertexData[index + 2][1] = d * h0 + b * w1 + ty;
        //UV
        uvData[index + 2][0] = uvs[6]; //frame.x / tw;
        uvData[index + 2][1] = uvs[7]; //(frame.y + frame.height) / th;

       
        //3 TL
        //Verts
        vertexData[index+3][0] = a * w1 + c * h1 + tx;
        vertexData[index+3][1] = d * h1 + b * w1 + ty;
        //UV
        uvData[index+3][0] = uvs[0]; //frame.x / tw;
        uvData[index+3][1] = uvs[1]; //frame.y / th;

        //4 TR
        //Verts
        vertexData[index + 4][0] = a * w0 + c * h1 + tx;
        vertexData[index + 4][1] = d * h1 + b * w0 + ty;
        //UV
        uvData[index + 4][0] = uvs[2]; //(frame.x + frame.width) / tw;
        uvData[index + 4][1] = uvs[3]; //frame.y / th;
        
        //5 BR
        //Verts
        vertexData[index + 5][0] = a * w0 + c * h0 + tx;
        vertexData[index + 5][1] = d * h0 + b * w0 + ty;
        //UV
        uvData[index + 5][0] = uvs[4]; //(frame.x + frame.width) / tw;
        uvData[index + 5][1] = uvs[5]; //(frame.y + frame.height) / th;

       
    }

    public calcExtents() {
        const width = this.texture.frame.width;
        const height = this.texture.frame.height;

        const aX = this.anchor.x;
        const aY = this.anchor.y;
        const w0 = width * (1 - aX);
        const w1 = width * -aX;

        const h0 = height * (1 - aY);
        const h1 = height * -aY;

        const a = this.worldTransform[0];
        const b = this.worldTransform[3];
        const c = this.worldTransform[1];
        const d = this.worldTransform[4];
        const tx = this.worldTransform[2];
        const ty = this.worldTransform[5];

        this.transformedVerts[0] = a * w1 + c * h1 + tx;
        this.transformedVerts[1] = d * h1 + b * w1 + ty;

        this.transformedVerts[2] = a * w0 + c * h1 + tx;
        this.transformedVerts[3] = d * h1 + b * w0 + ty;

        this.transformedVerts[4] = a * w0 + c * h0 + tx;
        this.transformedVerts[5] = d * h0 + b * w0 + ty;

        this.transformedVerts[6] = a * w1 + c * h0 + tx;
        this.transformedVerts[7] = d * h0 + b * w1 + ty;
    }
}