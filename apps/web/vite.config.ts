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
		build: {
			rolldownOptions: {
				onLog(level, log, defaultHandler) {
					const reactDirectiveWarning =
						log.message.includes('"use client"') || log.message.includes('"use no memo"');
					const ignoredReactDirectiveWarning =
						level === 'warn' &&
						log.code === 'MODULE_LEVEL_DIRECTIVE' &&
						reactDirectiveWarning &&
						log.id?.includes('node_modules/');

					if (!ignoredReactDirectiveWarning) defaultHandler(level, log);
				}
			}
		},
		optimizeDeps: {
			exclude: ['maplibre-gl']
		},
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
			api: {
				host: '127.0.0.1'
			},
			projects: [
				{
					extends: './vite.config.ts',
					test: {
						name: 'client',
						browser: {
							enabled: true,
							provider: playwright(),
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
