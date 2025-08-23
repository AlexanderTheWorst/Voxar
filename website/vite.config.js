import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { config } from 'dotenv';

config({ path: '../.env', quiet: true, override: false }); // Load .env

// Verify .env	
console.assert(process.env.DISCORD_OAUTH2_CLIENT_ID, "Missing DISCORD_OAUTH2_CLIENT_ID in .env");
console.assert(process.env.DISCORD_OAUTH2_CLIENT_SECRET, "Missing DISCORD_OAUTH2_CLIENT_SECRET in .env");
console.assert(process.env.DISCORD_OAUTH2_REDIRECT_URI, "Missing DISCORD_OAUTH2_REDIRECT_URI in .env");
console.assert(process.env.DISCORD_OAUTH2_REDIRECT_URI_DEV, "Missing DISCORD_OAUTH2_REDIRECT_URI_DEV in .env");

export default defineConfig({
	server: {
		host: '0.0.0.0'
	},
	plugins: [tailwindcss(), sveltekit()],
	ssr: {
		external: ['@prisma/client', '.prisma/client']
	}
});
