import { readFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = JSON.parse(readFileSync('./package.json'));

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

// 创建两个不同的 TypeScript 配置
const tsConfigESM = {
  tsconfig: './tsconfig.json',
  outDir: 'dist/es',
  declaration: true,
}

const tsConfigCJS = {
  ...tsConfigESM,
  outDir: 'dist/cjs',
  declaration: false,
}

export default [
  // ES Module 格式
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/es',
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
      typescript(tsConfigESM),
    ],
    external: ['react', 'react-dom', '@ql/libs']
  },
  // CommonJS 格式
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/cjs',
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
      typescript(tsConfigCJS),
    ],
    external: ['react', 'react-dom', '@ql/libs']
  }
];