export const userRoles = [
  'creative_evangelist',
  'sower',
  'gatekeeper',
  'seed_allocator',
  'stewardship_staff',
  'admin',
] as const;

export type UserRole = (typeof userRoles)[number];

export const authValidation = {
  passwordMinLength: 8,
  passwordMaxLength: 32,
  passwordMinSymbols: 1,
  firstNameMinLength: 1,
  lastNameMinLength: 1,
} as const;

const emailAddressPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordSymbolPattern = /[^A-Za-z0-9\s]/g;

export const normalizeNamePart = (value: string) => {
  return value.trim().replace(/\s+/g, ' ');
};

export const buildFullName = (firstName: string, lastName: string) => {
  return [normalizeNamePart(firstName), normalizeNamePart(lastName)].filter(Boolean).join(' ');
};

export const isValidFirstName = (value: string) => {
  return normalizeNamePart(value).length >= authValidation.firstNameMinLength;
};

export const isValidLastName = (value: string) => {
  return normalizeNamePart(value).length >= authValidation.lastNameMinLength;
};

export const isValidEmailAddress = (value: string) => {
  return emailAddressPattern.test(value.trim());
};

export const countPasswordSymbols = (value: string) => {
  return value.match(passwordSymbolPattern)?.length ?? 0;
};

export const hasRequiredPasswordSymbols = (value: string) => {
  return countPasswordSymbols(value) >= authValidation.passwordMinSymbols;
};

export const twoFactorRecommendedRoles = ['creative_evangelist', 'sower'] as const;

export const twoFactorRequiredRoles = [
  'gatekeeper',
  'seed_allocator',
  'stewardship_staff',
  'admin',
] as const satisfies readonly UserRole[];

export const accountLifecycleStages = [
  'pending_email_verification',
  'active',
  'password_reset_required',
  'email_change_pending',
  'disabled',
] as const;

export type AccountLifecycleStage = (typeof accountLifecycleStages)[number];

export const authFlowKeys = [
  'sign_up',
  'sign_in',
  'verify_email',
  'password_reset',
  'email_update',
  'two_factor_authentication',
  'sower_claim',
] as const;

export type AuthFlowKey = (typeof authFlowKeys)[number];

export type RoleCapabilityMap = Record<UserRole, readonly string[]>;

export const roleRequiresTwoFactor = (role: UserRole) => {
  return (twoFactorRequiredRoles as readonly UserRole[]).includes(role);
};

export const rolesRequireTwoFactor = (roles: readonly UserRole[]) => {
  return roles.some(roleRequiresTwoFactor);
};

export const roleCapabilities: RoleCapabilityMap = {
  creative_evangelist: [
    'create draft projects',
    'submit projects for review',
    'respond to revision requests',
    'propose edits to owned projects',
    'view owned project history',
  ],
  sower: [
    'sign in to an account',
    'view personal seed history',
    'claim a manually created sower record',
  ],
  gatekeeper: [
    'review submissions and edits',
    'approve, reject, or request revisions',
    'control project visibility and publishing',
    'mark completed projects as case studies',
  ],
  seed_allocator: [
    'create manual sower records',
    'link a seed to a project',
    'mark a project as sown',
    'maintain seed allocation records',
  ],
  stewardship_staff: [
    'view project and seed records',
    'view archived items',
    'support stewardship workflows',
  ],
  admin: [
    'manage users',
    'assign roles',
    'manage security-sensitive platform settings',
    'oversee access policies',
  ],
};

export interface AuthCapabilities {
  readonly supportedRoles: readonly UserRole[];
  readonly additiveRoles: boolean;
  readonly lifecycleStages: readonly AccountLifecycleStage[];
  readonly supportedFlows: readonly AuthFlowKey[];
  readonly roleCapabilities: RoleCapabilityMap;
  readonly security: {
    readonly emailVerificationRequired: boolean;
    readonly passwordResetEnabled: boolean;
    readonly emailUpdateEnabled: boolean;
    readonly twoFactorAuthentication: 'totp_with_backup_codes';
    readonly twoFactorPolicy: {
      readonly recommendedRoles: readonly UserRole[];
      readonly requiredRoles: readonly UserRole[];
      readonly trustedDevicesEnabled: boolean;
      readonly backupCodesEnabled: boolean;
    };
    readonly auditSensitiveActions: boolean;
  };
  readonly validation: {
    readonly passwordMinLength: number;
    readonly passwordMaxLength: number;
    readonly passwordMinSymbols: number;
    readonly firstNameMinLength: number;
    readonly lastNameMinLength: number;
  };
  readonly sowerClaiming: {
    readonly enabled: boolean;
    readonly preservesHistory: boolean;
    readonly verification: 'email_ownership_plus_staff_review';
  };
}

export const authCapabilities: AuthCapabilities = {
  supportedRoles: userRoles,
  additiveRoles: true,
  lifecycleStages: accountLifecycleStages,
  supportedFlows: authFlowKeys,
  roleCapabilities,
  security: {
    emailVerificationRequired: true,
    passwordResetEnabled: true,
    emailUpdateEnabled: true,
    twoFactorAuthentication: 'totp_with_backup_codes',
    twoFactorPolicy: {
      recommendedRoles: twoFactorRecommendedRoles,
      requiredRoles: twoFactorRequiredRoles,
      trustedDevicesEnabled: true,
      backupCodesEnabled: true,
    },
    auditSensitiveActions: true,
  },
  validation: authValidation,
  sowerClaiming: {
    enabled: true,
    preservesHistory: true,
    verification: 'email_ownership_plus_staff_review',
  },
};
