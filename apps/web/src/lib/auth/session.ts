export interface TwoFactorState {
	enabled: boolean;
	enabledAt: string | null;
	required: boolean;
	requiredForRoles: string[];
	satisfied: boolean;
}

export interface SowerProfileSummary {
	id: string;
	displayName: string;
	contactEmail: string | null;
	source: string;
	notes: string | null;
	linkedUserId: string | null;
	createdByUserId: string | null;
	createdAt: string;
	updatedAt: string;
	claimedAt: string | null;
}

export interface AuthViewer {
	session: {
		id: string;
		expiresAt: string;
		token: string;
		createdAt: string;
		updatedAt: string;
		ipAddress: string | null;
		userAgent: string | null;
		userId: string;
	};
	user: {
		id: string;
		email: string;
		name: string | null;
		emailVerified: boolean;
		twoFactorEnabled: boolean;
		image: string | null;
		createdAt: string;
		updatedAt: string;
		firstName?: string | null;
		lastName?: string | null;
		phoneNumber?: string | null;
		twoFactorEnabledAt?: string | null;
		passwordChangedAt?: string | null;
	};
	roles: string[];
	security: {
		twoFactor: TwoFactorState;
	};
	sowerProfile: SowerProfileSummary | null;
}

export interface AuthSecurityViewer {
	twoFactor: TwoFactorState;
	routes: {
		basePath: string;
		manage: {
			enable: string;
			disable: string;
			clearTrustedDevices: string;
			getTotpUri: string;
			verifyTotp: string;
			verifyBackupCode: string;
			generateBackupCodes: string;
		};
	};
}
