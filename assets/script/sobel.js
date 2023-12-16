// input: imageData object with RGBA data
// output: 2D array with edge detection data. Note, 1 channel per pixel.
export default function createEdgeMapFromImageData(imageData) {
  let pixels = new Uint8ClampedArray(imageData.data.length * 0.25);
  let width = imageData.width;
  let data = imageData.data;
  const sobel_v = [
    -1.0, 0.0, +1.0,
    -2.0, 0.0, +2.0,
    -1.0, 0.0, +1.0
  ];
  
  const sobel_h = [
    -1.0, -2.0, -1.0,
    0.0,  0.0,  0.0,
    +1.0, +2.0, +1.0
  ];

  // create greyscale first
  {
    let i = imageData.data.length;
    while (i) {
      // let a = data[i-1];
      let b = data[i-2];
      let g = data[i-3];
      let r = data[i-4];
      pixels[i*0.25] = 0.3*r + 0.59*g + 0.11*b; // Luminocity weighted average.
      i -= 4;
    }
  }

  // now edge detect
  for (let i = 0; i < pixels.length; i++) {
    // loop our 3x3 kernels, build our kernel values
    let hSum = 0;
    let vSum = 0;
    for (let y = 0; y < 3; y++)
      for (let x = 0; x < 3; x++) {
        let pixel = pixels[i + (width * y) + x];
        let kernelAccessor = x * 3 + y;
        hSum += pixel * sobel_h[kernelAccessor];
        vSum += pixel * sobel_v[kernelAccessor];
      }
    // apply kernel evaluation to current pixel
    pixels[i] = Math.sqrt(hSum * hSum + vSum * vSum);
  };

  return pixels;
}