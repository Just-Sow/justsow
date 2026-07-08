import {
	authValidation,
	buildFullName,
	hasRequiredPasswordSymbols,
	isValidEmailAddress,
	isValidFirstName,
	isValidLastName,
	normalizeNamePart
} from '../../../../../packages/shared/src/index.js';

export { authValidation, buildFullName, isValidEmailAddress, normalizeNamePart };

export const validateRequired = (value: string, message: string) => {
	return value.trim() ? '' : message;
};

export const validateEmail = (value: string) => {
	if (!value.trim()) {
		return 'Email is required.';
	}

	return isValidEmailAddress(value) ? '' : 'Enter a valid email address.';
};

export const validateFirstName = (value: string) => {
	if (!value.trim()) {
		return 'First name is required.';
	}

	return isValidFirstName(value) ? '' : 'Please enter your first name.';
};

export const validateLastName = (value: string) => {
	if (!value.trim()) {
		return 'Last name is required.';
	}

	return isValidLastName(value) ? '' : 'Please enter your last name.';
};

export const validatePassword = (value: string) => {
	if (!value) {
		return 'Password is required.';
	}

	if (value.length < authValidation.passwordMinLength) {
		return `Password must be at least ${authValidation.passwordMinLength} characters.`;
	}

	if (value.length > authValidation.passwordMaxLength) {
		return `Password must be no more than ${authValidation.passwordMaxLength} characters.`;
	}

	if (!hasRequiredPasswordSymbols(value)) {
		return `Password must include at least ${authValidation.passwordMinSymbols} symbol.`;
	}

	return '';
};

export const validatePasswordConfirmation = (password: string, confirmation: string) => {
	if (!confirmation) {
		return 'Please confirm your password.';
	}

	return password === confirmation ? '' : 'Your password confirmation does not match.';
};
