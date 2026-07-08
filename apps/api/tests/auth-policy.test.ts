import test from 'node:test';
import assert from 'node:assert/strict';
import {
  authCapabilities,
  roleRequiresTwoFactor,
  rolesRequireTwoFactor,
} from '../../../packages/shared/src/index.js';
import { getIdentityTwoFactorState } from '../src/auth/session.js';

test('shared auth capabilities expose accepted two-factor policy', () => {
  assert.equal(authCapabilities.security.twoFactorAuthentication, 'totp_with_backup_codes');
  assert.deepEqual(authCapabilities.security.twoFactorPolicy.recommendedRoles, [
    'creative_evangelist',
    'sower',
  ]);
  assert.deepEqual(authCapabilities.security.twoFactorPolicy.requiredRoles, [
    'gatekeeper',
    'seed_allocator',
    'stewardship_staff',
    'admin',
  ]);
});

test('roleRequiresTwoFactor matches the accepted role policy', () => {
  assert.equal(roleRequiresTwoFactor('creative_evangelist'), false);
  assert.equal(roleRequiresTwoFactor('sower'), false);
  assert.equal(roleRequiresTwoFactor('gatekeeper'), true);
  assert.equal(roleRequiresTwoFactor('seed_allocator'), true);
  assert.equal(roleRequiresTwoFactor('stewardship_staff'), true);
  assert.equal(roleRequiresTwoFactor('admin'), true);
  assert.equal(rolesRequireTwoFactor(['creative_evangelist', 'admin']), true);
});

test('identity two-factor state reflects mixed-role requirements', () => {
  assert.deepEqual(
    getIdentityTwoFactorState(['creative_evangelist'], { twoFactorEnabled: false }),
    {
      enabled: false,
      required: false,
      requiredForRoles: [],
      satisfied: true,
    }
  );

  assert.deepEqual(
    getIdentityTwoFactorState(['admin'], { twoFactorEnabled: false }),
    {
      enabled: false,
      required: true,
      requiredForRoles: ['admin'],
      satisfied: false,
    }
  );

  assert.deepEqual(
    getIdentityTwoFactorState(['creative_evangelist', 'gatekeeper'], { twoFactorEnabled: true }),
    {
      enabled: true,
      required: true,
      requiredForRoles: ['gatekeeper'],
      satisfied: true,
    }
  );
});
