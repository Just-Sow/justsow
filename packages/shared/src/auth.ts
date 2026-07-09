export const userRoles = [
  "creative_evangelist",
  "sower",
  "gatekeeper",
  "seed_allocator",
  "stewardship_staff",
  "admin",
] as const;

export type UserRole = (typeof userRoles)[number];

export const authValidation = {
  passwordMinLength: 8,
  passwordMaxLength: 32,
  passwordMinSymbols: 1,
  firstNameMinLength: 1,
  lastNameMinLength: 1,
  phoneMinDigits: 7,
  phoneMaxDigits: 15,
} as const;

export const normalizeNamePart = (value: string) => {
  const trimmedValue = value.trim();
  let result = "";
  let previousWasWhitespace = false;

  for (const character of trimmedValue) {
    const isWhitespace = character.trim() === "";

    if (isWhitespace) {
      previousWasWhitespace = true;
      continue;
    }

    if (previousWasWhitespace && result) {
      result += " ";
    }

    result += character;
    previousWasWhitespace = false;
  }

  return result;
};

const isAllowedEmailCharacter = (character: string) => {
  const codePoint = character.codePointAt(0);

  if (codePoint === undefined) {
    return false;
  }

  const isLowercaseLetter = codePoint >= 97 && codePoint <= 122;
  const isUppercaseLetter = codePoint >= 65 && codePoint <= 90;
  const isDigit = codePoint >= 48 && codePoint <= 57;

  return (
    isLowercaseLetter ||
    isUppercaseLetter ||
    isDigit ||
    "!#$%&'*+/=?^_`{|}~-.".includes(character)
  );
};

const isAllowedPhoneCharacter = (character: string) => {
  const codePoint = character.codePointAt(0);

  if (codePoint === undefined) {
    return false;
  }

  const isDigit = codePoint >= 48 && codePoint <= 57;

  return isDigit || character === "+" || character === "(" || character === ")" || character === "-" || character === " ";
};

export const buildFullName = (firstName: string, lastName: string) => {
  return [normalizeNamePart(firstName), normalizeNamePart(lastName)]
    .filter(Boolean)
    .join(" ");
};

export const isValidFirstName = (value: string) => {
  return normalizeNamePart(value).length >= authValidation.firstNameMinLength;
};

export const isValidLastName = (value: string) => {
  return normalizeNamePart(value).length >= authValidation.lastNameMinLength;
};

export const isValidEmailAddress = (value: string) => {
  const normalizedValue = value.trim();

  if (!normalizedValue || normalizedValue.includes(" ")) {
    return false;
  }

  const atIndex = normalizedValue.indexOf("@");
  if (atIndex <= 0 || atIndex !== normalizedValue.lastIndexOf("@")) {
    return false;
  }

  const localPart = normalizedValue.slice(0, atIndex);
  const domainPart = normalizedValue.slice(atIndex + 1);

  if (!localPart || !domainPart || domainPart.startsWith(".") || domainPart.endsWith(".")) {
    return false;
  }

  if (!localPart.split("").every(isAllowedEmailCharacter)) {
    return false;
  }

  const domainLabels = domainPart.split(".");
  if (domainLabels.length < 2) {
    return false;
  }

  if (domainLabels.some((label) => !label)) {
    return false;
  }

  return domainLabels.every((label) =>
    label.split("").every((character) => {
      const codePoint = character.codePointAt(0);

      if (codePoint === undefined) {
        return false;
      }

      const isLowercaseLetter = codePoint >= 97 && codePoint <= 122;
      const isUppercaseLetter = codePoint >= 65 && codePoint <= 90;
      const isDigit = codePoint >= 48 && codePoint <= 57;

      return isLowercaseLetter || isUppercaseLetter || isDigit || character === "-";
    })
  );
};

export const normalizePhoneNumber = (value: string) => {
  const trimmedValue = value.trim();
  let result = "";
  let previousWasWhitespace = false;

  for (const character of trimmedValue) {
    const isWhitespace = character.trim() === "";

    if (isWhitespace) {
      previousWasWhitespace = true;
      continue;
    }

    if (previousWasWhitespace && result) {
      result += " ";
    }

    result += character;
    previousWasWhitespace = false;
  }

  return result;
};

export const isValidPhoneNumber = (value: string) => {
  const normalizedValue = normalizePhoneNumber(value);

  if (!normalizedValue) {
    return false;
  }

  let digitCount = 0;
  let hasLeadingPlus = false;

  for (const character of normalizedValue) {
    if (character === "+" && digitCount === 0 && !hasLeadingPlus) {
      hasLeadingPlus = true;
      continue;
    }

    if (character === " " || character === "(" || character === ")" || character === "-") {
      continue;
    }

    if (!isAllowedPhoneCharacter(character)) {
      return false;
    }

    digitCount += 1;
  }

  return (
    digitCount >= authValidation.phoneMinDigits &&
    digitCount <= authValidation.phoneMaxDigits
  );
};

export const countPasswordSymbols = (value: string) => {
  let count = 0;

  for (const character of value) {
    const codePoint = character.codePointAt(0);

    if (codePoint === undefined) {
      continue;
    }

    const isLowercaseLetter = codePoint >= 97 && codePoint <= 122;
    const isUppercaseLetter = codePoint >= 65 && codePoint <= 90;
    const isDigit = codePoint >= 48 && codePoint <= 57;
    const isWhitespace = character.trim() === "";

    if (isLowercaseLetter || isUppercaseLetter || isDigit || isWhitespace) {
      continue;
    }

    count += 1;
  }

  return count;
};

export const hasRequiredPasswordSymbols = (value: string) => {
  return countPasswordSymbols(value) >= authValidation.passwordMinSymbols;
};

export const twoFactorRecommendedRoles = [
  "creative_evangelist",
  "sower",
] as const;

export const twoFactorRequiredRoles = [
  "gatekeeper",
  "seed_allocator",
  "stewardship_staff",
  "admin",
] as const satisfies readonly UserRole[];

export const accountLifecycleStages = [
  "pending_email_verification",
  "active",
  "password_reset_required",
  "email_change_pending",
  "disabled",
] as const;

export type AccountLifecycleStage = (typeof accountLifecycleStages)[number];

export const authFlowKeys = [
  "sign_up",
  "sign_in",
  "verify_email",
  "password_reset",
  "email_update",
  "two_factor_authentication",
  "sower_claim",
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
    "create draft projects",
    "submit projects for review",
    "respond to revision requests",
    "propose edits to owned projects",
    "view owned project history",
  ],
  sower: [
    "sign in to an account",
    "view personal seed history",
    "claim a manually created sower record",
  ],
  gatekeeper: [
    "review submissions and edits",
    "approve, reject, or request revisions",
    "control project visibility and publishing",
    "mark completed projects as case studies",
  ],
  seed_allocator: [
    "create manual sower records",
    "link a seed to a project",
    "mark a project as sown",
    "maintain seed allocation records",
  ],
  stewardship_staff: [
    "view project and seed records",
    "view archived items",
    "support stewardship workflows",
  ],
  admin: [
    "manage users",
    "assign roles",
    "manage security-sensitive platform settings",
    "oversee access policies",
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
    readonly twoFactorAuthentication: "totp_with_backup_codes";
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
    readonly phoneMinDigits: number;
    readonly phoneMaxDigits: number;
  };
  readonly sowerClaiming: {
    readonly enabled: boolean;
    readonly preservesHistory: boolean;
    readonly verification: "email_ownership_plus_staff_review";
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
    twoFactorAuthentication: "totp_with_backup_codes",
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
    verification: "email_ownership_plus_staff_review",
  },
};
