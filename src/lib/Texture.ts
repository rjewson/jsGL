export class Texture extends ImageData {

    //Faster than using base class width and height
    public _width: number;
    public _height: number;

    constructor(imageData: ImageData) {
        super(imageData.data, imageData.width, imageData.height);
        this._width = imageData.width;
        this._height = imageData.height;
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
            const imageData = textureCtx.getImageData(0, 0, img.width, img.height);
            const texture = new Texture(imageData);
            resolve(texture);
        }
        img.onerror = reject
        img.src = url
    })
}