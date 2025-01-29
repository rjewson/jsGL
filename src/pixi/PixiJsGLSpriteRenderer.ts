import { BlendMode, DrawingBuffer } from "../lib/DrawingBuffer";
import { Texture } from "../lib/Texture";
import { Point } from "../lib/Types";
import { Container } from "./Container";
import { DisplayObject } from "./DisplayObject";
import { Sprite } from "./Sprite";
import { Stage } from "./Stage";

//Pixi Batch renderer

const BUFFER_SIZE = 100;
const ENTRIES_PER_TRIANGLE = 3;

// Init vertex buffers
const vertexData: Point[] = new Array<Point>(BUFFER_SIZE * ENTRIES_PER_TRIANGLE);
for (let i = 0; i < vertexData.length; i++) {
    vertexData[i] = [0, 0];
}
// Init uv buffers
const uvData: Point[] = new Array<Point>(BUFFER_SIZE * ENTRIES_PER_TRIANGLE);
for (let i = 0; i < uvData.length; i++) {
    uvData[i] = [0, 0];
}

export function drawDisplayList(fb: DrawingBuffer, stage: Stage, draw: (fb: DrawingBuffer, vertexData: Point[], uvData: Point[], texture: Texture, blendMode: BlendMode, count: number) => void) {
    // Each display list item updates its transform
    stage.updateTransform();

    var node: Container;
    var stack: Array<Container>;
    var top: number;

    node = stage;
    stack = new Array<Container>(BUFFER_SIZE);

    stack[0] = node;
    top = 1;

    var indexRun = 0;

    var currentTexture: Texture = null;
    var currentBlendMode: BlendMode = null;

    node.iterate((node: DisplayObject) => {
        if (node.visible && node.renderable) {
            var sprite: Sprite = node as Sprite;
            if (sprite.texture.baseTexture != currentTexture || sprite.blendMode != currentBlendMode || indexRun == BUFFER_SIZE) {
                if (indexRun > 0) {
                    // If we have data to draw, flush it to the GPU
                    draw(fb, vertexData, uvData, currentTexture, currentBlendMode, indexRun);
                }
                indexRun = 0;
                currentTexture = sprite.texture.baseTexture;
                currentBlendMode = sprite.blendMode;
            }
            // 'draw' the sprite verticies and uvs into the buffers
            sprite.draw(indexRun * ENTRIES_PER_TRIANGLE * 2, vertexData, uvData);
            indexRun++;
        }
    });

    if (indexRun > 0) {
        // any remaining data needs to be flushed
        draw(fb, vertexData, uvData, currentTexture, currentBlendMode, indexRun);
    }
}