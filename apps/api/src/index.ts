import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { connectMongoDB, disconnectMongoDB } from './config/mongodb.ts';
import { disconnectRedis } from './config/redis.ts';
import { initializeSocket, closeSocketServer } from './config/socket.ts';
import { closeQueues } from './config/queues.ts';
import { assignmentsRouter } from './routes/assignments.ts';
import { healthRouter } from './routes/health.ts';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.ts';

const app = express();
const PORT = parseInt(process.env.PORT || '3000');

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health', healthRouter);
app.use('/api/assignments', assignmentsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const httpServer = createServer(app);
const io = initializeSocket(httpServer);

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

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

bootstrap();
