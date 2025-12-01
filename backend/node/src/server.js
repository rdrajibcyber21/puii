import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { createApp } from './app.js';
import { config } from './config.js';
import { logger } from './lib/logger.js';
import { startAutoFetch } from './services/dataFetcherService.js';
import { setIoInstance } from './lib/realtime.js';

const app = createApp();
const server = http.createServer(app);

let io;
if (config.ws.enable) {
  io = new SocketServer(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    logger.debug('WebSocket client connected', { id: socket.id });
  });

  setIoInstance(io);
}

const port = config.port;
server.listen(port, () => {
  logger.info(`API gateway listening on port ${port}`);
  
  // Start auto-fetching data from online sources every 30 minutes
  // Set to null or comment out to disable auto-fetch
  if (process.env.AUTO_FETCH_ENABLED !== 'false') {
    startAutoFetch(30); // Fetch every 30 minutes
  }
});

export { io };
