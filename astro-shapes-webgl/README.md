# Astro Shapes — interactive WebGL homepage prototype

A deployable, responsive homepage concept inspired by the supplied Astro Shapes composition.

## Experience
- True 3D extruded `astro` typography rendered with Three.js / WebGL
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

This is a working interaction prototype, **not a pixel-perfect reproduction of the official Astro Shapes trademark**. The 3D lettering is currently an approximation using bundled Three.js type geometry. To make the 3D extrusion match the exact Astro Shapes logotype, replace the `TextGeometry` setup in `src/main.js` with custom extruded outlines from the approved vector logo (SVG/AI). The stylized four-point star is also approximate. Review copyright and approval before publishing it as the official corporate site.

Replace the example links with verified Astro Shapes destinations and plug in final photography or content as approved. Built-in 3D metal appearance uses a procedural studio room environment rather than externally hosted HDR images.
