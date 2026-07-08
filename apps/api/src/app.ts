import Fastify from 'fastify';
import { authRoutes } from './routes/auth.js';
import { healthRoutes } from './routes/health.js';

export const buildApp = () => {
  const app = Fastify({
    logger: true,
  });

  void app.register(authRoutes);
  void app.register(healthRoutes);

  return app;
};
