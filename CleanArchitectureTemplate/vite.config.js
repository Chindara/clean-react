import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		{
			name: 'treat-js-files-as-jsx',
			async transform(code, id) {
				if (!id.match(/src\/.*\.js$/)) return null;

				// Use the exposed transform from vite, instead of directly
				// transforming with esbuild
				return transformWithEsbuild(code, id, {
					loader: 'jsx',
					jsx: 'automatic',
				});
			},
		},
		react(),
		eslintPlugin({
			cache: false,
			include: ['./src/**/*.js', './src/**/*.jsx'],
			exclude: [],
		}),
	],

	optimizeDeps: {
		force: true,
		esbuildOptions: {
			loader: {
				'.js': 'jsx',
			},
		},
	},

	resolve: {
		alias: {
			assets: `${path.resolve(__dirname, './src/assets/')}`,
			common: `${path.resolve(__dirname, './src/common/')}`,
			store: `${path.resolve(__dirname, './src/store/')}`,
			contexts: `${path.resolve(__dirname, './src/contexts/')}`,
			routes: `${path.resolve(__dirname, './src/routes/')}`,
			themes: `${path.resolve(__dirname, './src/themes/')}`,
			components: `${path.resolve(__dirname, './src/components/')}`,
			hooks: `${path.resolve(__dirname, './src/hooks/')}`,
			layout: `${path.resolve(__dirname, './src/layout/')}`,
			pages: `${path.resolve(__dirname, './src/pages/')}`,
			utils: `${path.resolve(__dirname, './src/utils/')}`,
			containers: `${path.resolve(__dirname, './src/containers/')}`,
			constants: `${path.resolve(__dirname, './src/constants/')}`,
			services: `${path.resolve(__dirname, './src/services/')}`,
			validations: `${path.resolve(__dirname, './src/validations/')}`,
			config: `${path.resolve(__dirname, './src/config')}`,
		},
	},

	server: {
		open: true,
	},
});
