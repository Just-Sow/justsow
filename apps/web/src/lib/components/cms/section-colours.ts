export const foregroundColourClasses: Record<string, string> = {
	primary: 'text-primary',
	secondary: 'text-secondary',
	accent: 'text-accent'
};

export const foregroundBorderClasses: Record<string, string> = {
	primary: 'border-primary',
	secondary: 'border-secondary',
	accent: 'border-accent'
};

export const backgroundColourValues: Record<string, string> = {
	background: 'var(--color-background)',
	muted: 'var(--color-muted)',
	warm: 'var(--color-warm)',
	primaryTint: 'var(--color-primary-tint)'
};

export const sectionBackground = (value: string | null | undefined) =>
	backgroundColourValues[value ?? 'background'] ?? backgroundColourValues.background;
