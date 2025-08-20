import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { config} from 'dotenv';

config({ path: '../.env' }); // Load .env

export default defineConfig({
	server: {
		host: '0.0.0.0'
	},
	plugins: [tailwindcss(), sveltekit()]
});
