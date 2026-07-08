import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';

test('GET /health returns ok status', async () => {
  const app = buildApp();

  const response = await app.inject({
    method: 'GET',
    url: '/health',
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(
    {
      status: 'ok',
    },
    {
      status: response.json().status,
    }
  );

  await app.close();
});
