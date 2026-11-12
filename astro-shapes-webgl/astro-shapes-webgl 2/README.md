# Astro Shapes — interactive WebGL homepage prototype

A deployable, responsive homepage concept inspired by the supplied Astro Shapes composition.

## Experience
- True 3D extruded approved Astro Shapes logo, converted directly from `public/astro-logo.svg` using SVGLoader and Three.js
- Drag to rotate, scroll to zoom and gentle automatic movement
- Select Aluminum, Black Chrome or Copper for live metallic material changes
- A star tab expands / collapses the navigation
- Responsive homepage with supporting service sections

## Local development

```bash
npm install
npm run dev
```

Visit the local URL displayed by Vite (usually http://localhost:5173).

## Deploy on Vercel

1. Unzip the project and push it to a new GitHub repository.
2. In Vercel, select **Add New → Project** and import that repository.
3. Framework preset: **Vite** (usually detected automatically).
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy. No environment variables required.

Or install the Vercel CLI and run `vercel` from this folder.

## Production design handoff

This project now uses the **exact vector contours of the provided Astro.svg** in the WebGL object. All four source paths are extruded, preserving the brand letterforms, circular icon and negative spaces. There is no approximate font, decorative star or extra cylinder. The SVG also supplies the fallback logo for devices without WebGL. To change the artwork again, replace `public/astro-logo.svg` with a new SVG using the same viewBox dimensions (or update the `svgWidth` / `svgHeight` constants in `src/main.js`).

**Updating your existing Vercel site:** replace the contents of your current GitHub repository with this project's source, commit and push. Vercel will automatically redeploy if the repo is connected. If you use Vercel CLI, run `npm install`, `npm run build`, then `vercel --prod`. The ZIP alone does not modify the live deployment.

Replace the example links with verified Astro Shapes destinations and plug in final photography or content as approved. Built-in 3D metal appearance uses a procedural studio room environment rather than externally hosted HDR images.
