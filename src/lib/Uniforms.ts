import { Sampler } from "./Sampler";

type AllowedUniformTypes = number | Array<number> | Sampler;

//type AllowedUniformKeys = "a" | "b" | "c";

export type TUniforms<T extends string> = Partial<Record<T, AllowedUniformTypes>>;
