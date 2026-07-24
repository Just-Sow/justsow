import Fastify from 'fastify';
import { authAppRoutes } from './routes/auth-app.js';
import { authRoutes } from './routes/auth.js';
import { contactRoutes } from './routes/contact.js';
import { healthRoutes } from './routes/health.js';

export const buildApp = () => {
  const app = Fastify({
    logger: true,
  });

  void app.register(authAppRoutes);
  void app.register(authRoutes);
  void app.register(contactRoutes);
  void app.register(healthRoutes);

  return app;
};
