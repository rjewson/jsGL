export type Point = [x: number, y: number];
export type UV = [u: number, v: number];
export type Colour = [r: number, g: number, b: number, a: number];
export type BarycentricPoint = [alpha: number, theta: number, gamma: number];

export type TriangleVerticies = [number, number, number, number, number, number]; 

export type Triangle = [Point, Point, Point];
export type TriangleUV = [Point, Point, Point];

export type Fragment = {
  position: Point;
  bc: BarycentricPoint;
};

export const RED: Colour = [255, 0, 0, 255];
export const GREEN: Colour = [0, 255, 0, 255];
export const BLUE: Colour = [0, 0, 255, 255];  
export const EMPTY: Colour = [0, 0, 0, 0];

export const EMPTY_UV: UV = [0, 0];
