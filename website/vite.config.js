import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { config } from 'dotenv';

config({ path: '../.env', quiet: true, override: false }); // Load .env

export default defineConfig({
	server: {
		host: '0.0.0.0',
		https: false
	},
	plugins: [tailwindcss(), sveltekit()],
});
