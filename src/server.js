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
  socket.on('enter_room', (roomName, done) => {
    console.log(`Message: ${roomName}`);
    // done을 실행하면 백이 아니라 프론트에서 함수가 실행된다. (실행의 주체는 백)
    done('hello');
  });
});

httpServer.listen(3000, handleListen);
