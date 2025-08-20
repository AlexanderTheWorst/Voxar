const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.BiukN4Hx.js",app:"_app/immutable/entry/app.CkIbi2g-.js",imports:["_app/immutable/entry/start.BiukN4Hx.js","_app/immutable/chunks/DHV8DNnr.js","_app/immutable/chunks/ByNHyrXK.js","_app/immutable/chunks/BhrWO1zB.js","_app/immutable/chunks/Bi19Avw7.js","_app/immutable/entry/app.CkIbi2g-.js","_app/immutable/chunks/BhrWO1zB.js","_app/immutable/chunks/ByNHyrXK.js","_app/immutable/chunks/Bi19Avw7.js","_app/immutable/chunks/DsnmJJEf.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-Bx0Zl9_E.js')),
			__memo(() => import('./chunks/1-ng_oENcE.js')),
			__memo(() => import('./chunks/2-QsO81Yrk.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
