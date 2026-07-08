import { env } from './config/env.js';
import { buildApp } from './app.js';

const app = buildApp();

const start = async () => {
  try {
    await app.listen({
      host: '0.0.0.0',
      port: env.PORT,
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
