import ChromaKey from './chromaKey.js';

document.addEventListener('DOMContentLoaded', init);

function init() {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');

  const chromaKey = new ChromaKey(video, canvas);

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();
      
      const videoInformation = document.getElementById('videoInformation');
      videoInformation.innerHTML = `${settings.width}x${settings.height} ${settings.frameRate}fps`;

      video.srcObject = stream;
      video.play();
    })
    .catch(err => {
      console.error(err);
    });

  video.addEventListener('loadeddata', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    setInterval(() => chromaKey.run(), 1000/30);
  });

  settings(chromaKey);
}

function settings(chromaKey){
  const enableGrayScaleCheckbox = document.getElementById('enableGrayScale');
  const enableChromaKeyCheckbox = document.getElementById('enableChromaKey');
  const enableSobelCheckbox = document.getElementById('enableSobel');
  const chromaKeyColorInput = document.getElementById('chromaKeyColor');
  const chromaKeyImageBackgroundInput = document.getElementById('chromaKeyImageBackground');

  if(!enableGrayScale) return;
  enableGrayScaleCheckbox.addEventListener('change', (e) => {
    chromaKey.enableGrayScale = e.target.checked;
  });
  
  if(!enableChromaKey) return;
  enableChromaKeyCheckbox.addEventListener('change', (e) => {
    chromaKey.enableChromaKey = e.target.checked;
  }); 

  if(!enableSobel) return;
  enableSobelCheckbox.addEventListener('change', (e) => {
    chromaKey.enableSobel = e.target.checked;
  }); 

  if(!chromaKeyColorInput) return;
  chromaKeyColorInput.addEventListener('input', (e) => {
    const color = e.target.value;
    chromaKey.chromaKeyRed = parseInt(color.substr(1,2), 16);
    chromaKey.chromaKeyGreen = parseInt(color.substr(3,2), 16);
    chromaKey.chromaKeyBlue = parseInt(color.substr(5,2), 16);
  });

  if(!chromaKeyImageBackgroundInput) return;
  chromaKeyImageBackgroundInput.addEventListener('change', (e) => {
    canvas.style.backgroundImage = `url(${URL.createObjectURL(e.target.files[0])})`;
  });
}