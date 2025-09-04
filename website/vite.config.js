import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { config } from 'dotenv';

config({ path: '../.env', quiet: true, override: false }); // Load .env

import { connectDB } from '@voxar/mongodb';
connectDB();

export default defineConfig({
	server: {
		host: '0.0.0.0',
		https: false
	},
	optimizeDeps: {
		include: ['@voxar/shared'] // force Vite to pre-bundle
	},
	ssr: {
		noExternal: ['@voxar/shared'] // ensures it's treated as internal for SSR
	},
	fs: {
		allow: ['..'] // or specifically ['../shared']
	},
	plugins: [tailwindcss(), sveltekit()],
});