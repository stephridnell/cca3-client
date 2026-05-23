# who's that pokemon

A static Vue 2 game. No backend, no accounts — pokemon data is bundled, sprites come from the public PokeAPI sprite CDN, and scores/encounters live in `localStorage`.

## Develop

```
npm install
npm run serve
```

## Build

```
npm run build
```

Outputs to `dist/`.

## Deploy (Netlify)

`netlify.toml` is set up — point Netlify at this repo and it'll build with `npm run build` and publish `dist/`. The SPA fallback redirect is included so refreshing `/play`, `/pokedex`, etc. works.
