import typescript from '@rollup/plugin-typescript';
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/engine.bundle.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    nodePolyfills({ sourceMap: true }),
    typescript(),
  ],
};