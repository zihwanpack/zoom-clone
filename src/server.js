import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/*', (req, res) => res.render('home'));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
};

const countRoom = (roomName) => {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
};

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
  namespaceName: '/admin', // 기본값
  mode: 'development',
});

wsServer.on('connection', (socket) => {
  socket.nickname = 'Anonymous';
  socket.onAny((event) => {
    console.log(`Socket event : ${event}`);
  });
  socket.on('enter_room', (roomName, nickname, done) => {
    // done을 실행하면 백이 아니라 프론트에서 함수가 실행된다. (실행의 주체는 백)
    socket.nickname = nickname;
    socket.join(roomName);
    done();
    // 하나의 소켓에 메시지 보내기
    socket.to(roomName).emit('welcome', socket.nickname, countRoom(roomName));
    // 모든 소켓에게 메시지 보내기
    wsServer.sockets.emit('room_change', publicRooms());
  });
  // disconnecting으로 서버와 연결 끊기 직전에 실행시킬 수 있다. (disconnect와 다름)
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit('bye', socket.nickname, countRoom(room) - 1)
    );
  });
  socket.on('disconnect', () => {
    wsServer.sockets.emit('room_change', publicRooms());
  });
  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on('nickname', (nickname) => {
    socket.nickname = nickname;
  });
});

httpServer.listen(3000, handleListen);
