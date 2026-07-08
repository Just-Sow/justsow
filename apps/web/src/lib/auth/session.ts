export interface AuthViewer {
	user: {
		id: string;
		email: string;
		name: string | null;
		firstName?: string | null;
		lastName?: string | null;
	};
	roles: string[];
}
