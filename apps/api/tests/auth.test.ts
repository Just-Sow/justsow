import test from 'node:test';
import assert from 'node:assert/strict';
import { authCapabilities } from '../../../packages/shared/src/index.js';
import { buildApp } from '../src/app.js';

test('GET /auth/capabilities returns shared auth contract', async () => {
  const app = buildApp();

  const response = await app.inject({
    method: 'GET',
    url: '/auth/capabilities',
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), authCapabilities);

  await app.close();
});

test('GET /api/auth/get-session is handled by Better Auth', async () => {
  const app = buildApp();

  const response = await app.inject({
    method: 'GET',
    url: '/api/auth/get-session',
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['content-type'], 'application/json');
  assert.equal(response.body, 'null');

  await app.close();
});
