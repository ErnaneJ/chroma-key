import createEdgeMapFromImageData from './sobel.js';

export default class ChromaKey {
  constructor(video, canvas){
    this.video = video;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.enableGrayScale = false;
    this.enableChromaKey = false;
    this.enableSobel = false;

    // rgb(250, 106, 135) 

    this.chromaKeyRed = 250;
    this.chromaKeyGreen = 106;
    this.chromaKeyBlue = 135;
    this.chromaKeyThreshold = 100;
  }

  run(){
    this.context = this.canvas.getContext('2d');
    this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

    this.#chromaKey(imageData);
    this.#convertToGrayscale(imageData);
    
    this.context.putImageData(imageData, 0, 0);

    this.#Sobel(imageData);
  }

  #chromaKey(imageData){
    if(!this.enableChromaKey) return;

    const compare = (a, b) => a > b;

    const compareRedGreen = compare(this.chromaKeyRed, this.chromaKeyGreen);
    const compareRedBlue = compare(this.chromaKeyRed, this.chromaKeyBlue);
    const compareBlueGreen = compare(this.chromaKeyBlue, this.chromaKeyGreen);

    for(let i = 0; i < imageData.data.length; i++){
      const r = imageData.data[i * 4 + 0];
      const g = imageData.data[i * 4 + 1];
      const b = imageData.data[i * 4 + 2];

      if(
        (r+g+b)/3 > this.chromaKeyThreshold && 
        (compareRedGreen ? compare(r,g) : !compare(r,g)) &&
        (compareRedBlue ? compare(r,b) : !compare(r,b)) &&
        (compareBlueGreen ? compare(b,g) : !compare(b,g))
      ){ imageData.data[i * 4 + 3] = 0; };
    }
  }

  #Sobel(imageData){
    if(!this.enableSobel) return;
    const edge = createEdgeMapFromImageData(imageData);
    for(let i = 0; i < edge.length; i++){
      let x = i % canvas.width;
      let y = (i - x) / canvas.width;

      this.context.fillStyle = `rgba(${edge[i]}, ${edge[i]}, ${edge[i]}, 255)`;
      this.context.fillRect(x, y, 1, 1);
    }
  }

  #convertToGrayscale(imageData) {
    if(!this.enableGrayScale) return;
    for (let i = 0; i < imageData.data.length; i += 4) {
      const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
      imageData.data[i] = avg;
      imageData.data[i + 1] = avg;
      imageData.data[i + 2] = avg;
    }
  }
}