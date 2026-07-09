import { describe, expect, it } from 'vitest';
import {
	defaultPhoneCountry,
	parseStoredPhoneNumber,
	phoneCountryOptions,
	toE164PhoneNumber
} from './phone-countries.js';

describe('phone countries', () => {
	it('keeps the preferred countries first', () => {
		expect(phoneCountryOptions.slice(0, 5).map((country) => country.code)).toEqual([
			'GB',
			'AU',
			'NZ',
			'US',
			'CA'
		]);
	});

	it('defaults to Australia for local-format phone entry', () => {
		expect(defaultPhoneCountry.code).toBe('AU');
		expect(toE164PhoneNumber('0400 123 456', 'AU')).toBe('+61400123456');

		const parsed = parseStoredPhoneNumber('+61400123456');
		expect(parsed.country.code).toBe('AU');
		expect(parsed.localNumber.startsWith('04')).toBe(true);
	});
});
