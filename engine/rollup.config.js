import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/tonnetto.bundle.js',
    format: 'esm',
    sourcemap: true,
    inlineDynamicImports: true,
  },
  plugins: [
    typescript()
  ],
  external: ['process'], // Exclude 'process' from being bundled in the browser
};