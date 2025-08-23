// src/hooks.server.js
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

// Polyfill Node globals for SvelteKit SSR generated code
globalThis.__dirname = dirname(fileURLToPath(import.meta.url));
globalThis.__filename = fileURLToPath(import.meta.url);
globalThis.require = createRequire(import.meta.url);

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    return resolve(event);
}