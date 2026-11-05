import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Chemins relatifs : fonctionne sur GitHub Pages quel que soit le nom du dépôt.
  base: './',
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
