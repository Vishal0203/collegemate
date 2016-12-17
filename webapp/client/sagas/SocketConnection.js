import io from 'socket.io-client';

export default function createWebSocketConnection() {
  return io(process.env.SOCKET_SERVER)
}