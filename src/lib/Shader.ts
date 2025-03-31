import { Sampler } from "./Sampler";
import { Point, UV, Colour } from "./Types";
import { TUniforms } from "./Uniforms";

type Buffers = {
    vertex: Point[];
    uv: UV[];
}

type Attributes = {
    vertex: Point;
    uv: Point;
}

type Varying = {
    uv: UV;
}

type Uniforms = {
    sampler: Sampler;
}

const u: TUniforms<"sampler"> = {
    sampler: new Sampler()
}


type VertexShader<A, V, U> = (arg0: A, arg2: V, arg1: U, arg3: Point) => void;
type FragmentShader<V, U> = (arg0: V, arg1: U, arg3: Colour) => void;

function CreateShader<A, V, U extends TUniforms<any>>(vertexShader: VertexShader<A, V, U>, fragmentShader: FragmentShader<V, U>): void {
    return {
        vertexShader,
        fragmentShader,
        uniforms: u
    }
}