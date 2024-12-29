import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/*', (req, res) => res.render('home'));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);
wsServer.on('connection', (socket) => {
  socket.onAny((event) => {
    console.log(`Socket event : ${event}`);
  });
  socket.on('enter_room', (roomName, done) => {
    // done을 실행하면 백이 아니라 프론트에서 함수가 실행된다. (실행의 주체는 백)
    socket.join(roomName);
    done();
    socket.to(roomName).emit('welcome');
  });
  // disconnecting으로 서버와 연결 끊기 직전에 실행시킬 수 있다. (disconnect와 다름)
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => socket.to(room).emit('bye'));
  });
  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', msg);
    done();
  });
});

httpServer.listen(3000, handleListen);
