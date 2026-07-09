import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { playwright } from '@vitest/browser-playwright';
import Icons from 'unplugin-icons/vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const apiProxyTarget = env.JUSTSOW_API_ORIGIN || 'http://127.0.0.1:3000';

	return {
		plugins: [tailwindcss(), sveltekit(), Icons({ compiler: 'svelte', autoInstall: true })],
		server: {
			allowedHosts: ['cross-gabriel-territories-reduce.trycloudflare.com'],
			proxy: {
				'/api': {
					target: apiProxyTarget,
					changeOrigin: true
				},
				'/auth': {
					target: apiProxyTarget,
					changeOrigin: true
				}
			}
		},
		test: {
			expect: { requireAssertions: true },
			projects: [
				{
					extends: './vite.config.ts',
					test: {
						name: 'client',
						browser: {
							enabled: true,
							provider: playwright(),
							api: {
								host: '127.0.0.1'
							},
							instances: [{ browser: 'chromium' }]
						},
						include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
						exclude: ['src/lib/server/**'],
						setupFiles: ['./vitest-setup-client.ts']
					}
				},
				{
					extends: './vite.config.ts',
					test: {
						name: 'server',
						environment: 'node',
						include: ['src/**/*.{test,spec}.{js,ts}'],
						exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
					}
				}
			]
		}
	};
});
