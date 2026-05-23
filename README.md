# who's that pokemon

A Vue 2 game deployed as a static site on Netlify. Pokemon data is bundled; sprites come from the public PokeAPI sprite CDN. Personal stats (lifetime score, pokedex encounters) live in `localStorage`. The leaderboard is global, backed by Netlify Blobs via two Netlify Functions.

## Develop

Frontend only (leaderboard fetches will fail gracefully):

```
npm install
npm run serve
```

Frontend + functions (requires the Netlify CLI, which is a dev dep):

```
npm run dev
```

This runs `netlify dev`, which proxies the Vue dev server and serves the functions at `/api/*`.

## Build

```
npm run build
```

Outputs to `dist/`.

## Deploy (Netlify)

`netlify.toml` is configured — point Netlify at this repo and it will:

- Build with `npm run build` and publish `dist/`
- Bundle `netlify/functions/` and expose them at `/api/leaderboard` and `/api/submit-score`
- Provision a Netlify Blobs store automatically (no extra setup)
- Fall back to `index.html` so SPA refreshes on `/play`, `/pokedex`, etc. work
