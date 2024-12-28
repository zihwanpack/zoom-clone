// io function이 알아서 socket.io를 실행하는 서버를 찾는다.
const socket = io();
const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');

function backendDone(msg) {
  console.log(`backend say: ${msg}`);
}

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', input.value, backendDone);
  input.value = '';
};

form.addEventListener('submit', handleRoomSubmit);
