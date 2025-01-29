import { DrawingBuffer } from "../lib/DrawingBuffer";
import { Sampler, SamplerIndex } from "../lib/Sampler";
import { Point, UV } from "../lib/Types";

export const SAMPLER_0 = 0;
export const SAMPLER_1 = 1;

export type Buffers = {
  vertex: Point[];
  uv: UV[];
}

export type Attributes = {
  [K in keyof Buffers]: Buffers[K] extends (infer U)[] ? U : never;
}

export type Varying = {
  uv: UV;
}

export type Uniforms = {
  sampler: SamplerIndex;
}

export type RenderParams = {
  blendMode: string;
}

export class Program {}

export class jsGL {

    frameBuffer: DrawingBuffer;
    samplers: Sampler[];
    
    constructor() {
        this.frameBuffer = new DrawingBuffer(1024, 1024);
        this.samplers = [new Sampler(), new Sampler()];
    }

    clear() {
    }

}