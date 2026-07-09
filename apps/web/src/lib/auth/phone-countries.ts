import {
	AsYouType,
	getCountries,
	getCountryCallingCode,
	parsePhoneNumberFromString,
	type CountryCode
} from 'libphonenumber-js';

export interface PhoneCountryOption {
	code: CountryCode;
	name: string;
	callingCode: string;
	searchValue: string;
}

const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
const preferredCountryOrder: CountryCode[] = ['GB', 'AU', 'NZ', 'US', 'CA'];

const getCountryName = (code: CountryCode) => displayNames.of(code) ?? code;

const buildCountryOption = (code: CountryCode): PhoneCountryOption => {
	const name = getCountryName(code);
	const callingCode = `+${getCountryCallingCode(code)}`;

	return {
		code,
		name,
		callingCode,
		searchValue: `${name} ${code} ${callingCode}`
	};
};

const sortCountryOptions = (left: PhoneCountryOption, right: PhoneCountryOption) => {
	const leftPreferredIndex = preferredCountryOrder.indexOf(left.code);
	const rightPreferredIndex = preferredCountryOrder.indexOf(right.code);

	if (leftPreferredIndex !== -1 || rightPreferredIndex !== -1) {
		if (leftPreferredIndex === -1) {
			return 1;
		}

		if (rightPreferredIndex === -1) {
			return -1;
		}

		return leftPreferredIndex - rightPreferredIndex;
	}

	return left.name.localeCompare(right.name);
};

export const phoneCountryOptions = getCountries()
	.map((code) => buildCountryOption(code))
	.sort(sortCountryOptions);

export const defaultPhoneCountry = phoneCountryOptions.find((country) => country.code === 'AU')!;

export const findPhoneCountryOption = (code: CountryCode | undefined | null) => {
	if (!code) {
		return null;
	}

	return phoneCountryOptions.find((country) => country.code === code) ?? null;
};

export const formatPhoneNumberForCountry = (value: string, countryCode: CountryCode) => {
	if (!value.trim()) {
		return '';
	}

	return new AsYouType(countryCode).input(value);
};

export const parseStoredPhoneNumber = (value: string) => {
	const parsedNumber = parsePhoneNumberFromString(value);

	if (!parsedNumber?.country) {
		return {
			country: defaultPhoneCountry,
			localNumber: value
		};
	}

	return {
		country: findPhoneCountryOption(parsedNumber.country) ?? defaultPhoneCountry,
		localNumber: parsedNumber.formatNational()
	};
};

export const toE164PhoneNumber = (value: string, countryCode: CountryCode) => {
	const parsedNumber = parsePhoneNumberFromString(value, countryCode);

	if (!parsedNumber?.isValid()) {
		return null;
	}

	return parsedNumber.number;
};
