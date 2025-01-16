import { readFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = JSON.parse(readFileSync('./package.json'));

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default [
  // ES Module 格式
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/es',           // 改为 dist/es
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].js',
      sourcemap: true
    },
    plugins: [
      resolve({
        extensions: ['.ts', '.tsx']
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist/es',  // 改为 dist/es
        outDir: 'dist/es',          // 改为 dist/es
        jsx: 'react'
      }),
    ],
    external: ['react', 'react-dom', '@ql/libs']
  },
  // CommonJS 格式
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/cjs',          // 改为 dist/cjs
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].js',
      sourcemap: true
    },
    plugins: [
      resolve({
        extensions: ['.ts', '.tsx']
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        // declaration: false,
        // outDir: 'dist/cjs',      // 改为 dist/cjs
        // jsx: 'react'
      }),
    ],
    external: ['react', 'react-dom', '@ql/libs']
  }
];