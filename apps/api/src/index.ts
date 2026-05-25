import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { connectMongoDB, disconnectMongoDB } from './config/mongodb.js';
import { disconnectRedis } from './config/redis.js';
import { initializeSocket, closeSocketServer } from './config/socket.js';
import { closeQueues } from './config/queues.js';
import { assignmentsRouter } from './routes/assignments.js';
import { healthRouter } from './routes/health.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health', healthRouter);
app.use('/api/assignments', assignmentsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const httpServer = createServer(app);
initializeSocket(httpServer);

httpServer.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Set a different PORT in your environment.`);
    process.exit(1);
  }

  console.error('HTTP server error:', error);
  process.exit(1);
});

async function bootstrap(): Promise<void> {
  try {
    await connectMongoDB();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to bootstrap server:', error);
    process.exit(1);
  }
}

async function shutdown(): Promise<void> {
  console.log('Shutting down gracefully...');
  httpServer.close();
  await closeSocketServer();
  await disconnectMongoDB();
  await disconnectRedis();
  await closeQueues();
  process.exit(0);
}

process.on('SIGINT', () => {
  void shutdown();
});
process.on('SIGTERM', () => {
  void shutdown();
});

void bootstrap();
