// io function이 알아서 socket.io를 실행하는 서버를 찾는다.
const socket = io();

const myface = document.getElementById('myFace');
const muteButton = document.getElementById('mute');
const cameraButton = document.getElementById('camera');

// stream은 비디오와 오디오가 결합된 것이다.
let myStream;
let muted = false;
let cameraOff = false;

const getMedia = async () => {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    console.log(myStream);
    myface.srcObject = myStream;
  } catch (e) {
    console.log(e);
  }
};

getMedia();

const handleMuteClick = () => {
  if (!muted) {
    muteButton.innerText = 'Unmute';
    muted = true;
  } else {
    muteButton.innerText = 'Mute';
    muted = false;
  }
};
const handleCameraClick = () => {
  if (cameraOff) {
    cameraButton.innerText = 'Turn Camera Off';
    cameraOff = false;
  } else {
    cameraButton.innerText = 'Turn Camera On';
    cameraOff = true;
  }
};
muteButton.addEventListener('click', handleMuteClick);
cameraButton.addEventListener('click', handleCameraClick);
