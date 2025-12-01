import {
  websocketConnections,
  websocketMessagesTotal,
} from './metrics.js';

let ioInstance = null;

export const setIoInstance = (io) => {
  ioInstance = io;

  // Track WebSocket connections
  io.on('connection', (socket) => {
    websocketConnections.inc();

    socket.on('disconnect', () => {
      websocketConnections.dec();
    });
  });

  // Update connection count periodically
  setInterval(() => {
    const count = io.sockets.sockets.size;
    websocketConnections.set(count);
  }, 5000);
};

export const emitAlert = (alert) => {
  if (ioInstance) {
    ioInstance.emit('alert', alert);
    websocketMessagesTotal.inc({ type: 'alert' });
  }
};
