import { defineConfig } from 'vite';

// The Astro Shapes website is in a subfolder of this GitHub repository.
// Keep Vercel building from repository root without duplicating the website.
export default defineConfig({
  root: 'astro-shapes-webgl',
  publicDir: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});
