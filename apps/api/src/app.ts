import Fastify from 'fastify';
import { healthRoutes } from './routes/health.js';

export const buildApp = () => {
  const app = Fastify({
    logger: true,
  });

  void app.register(healthRoutes);

  return app;
};
