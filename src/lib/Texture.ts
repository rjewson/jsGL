export class Texture {

    imageData: ImageData;

    constructor(imageData: ImageData) {
        this.imageData = imageData;
    }
}

export async function loadTexture(url: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const textureCanvas = new OffscreenCanvas(img.width, img.height);
            const textureCtx = textureCanvas.getContext("2d", { willReadFrequently: true });
            textureCtx.drawImage(img, 0, 0);
            const texture = new Texture(textureCtx.getImageData(0, 0, img.width, img.height));
            resolve(texture);
        }
        img.onerror = reject
        img.src = url
    })
}