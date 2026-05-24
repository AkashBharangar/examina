import { Router, type Router as ExpressRouter } from 'express';
import mongoose from 'mongoose';
import { redis } from '../config/redis';
import { HealthCheckResponse } from '@examina/types';
import { getSocketServer } from '../config/socket.ts';

export const healthRouter: ExpressRouter = Router();

healthRouter.get('/', async (req, res) => {
  const databaseHealth = mongoose.connection.readyState === 1;
  const redisHealth = redis.status === 'ready';
  const socketHealth = Boolean(getSocketServer());

  const response: HealthCheckResponse = {
    status: databaseHealth && redisHealth ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    services: {
      database: databaseHealth,
      redis: redisHealth,
      socket: socketHealth,
    },
  };

  const statusCode = response.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(response);
});
