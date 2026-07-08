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
