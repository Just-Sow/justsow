declare module 'qrcode' {
	interface ToDataUrlOptions {
		margin?: number;
		width?: number;
	}

	const QRCode: {
		toDataURL(value: string, options?: ToDataUrlOptions): Promise<string>;
	};

	export default QRCode;
}
