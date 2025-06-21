import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

// 兼容性读取 package.json
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default [
  // 普通打包
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'FontLoadChecker',
        sourcemap: true,
        exports: 'named'
      },
    ],
    plugins: [
      resolve({ extensions }),
      commonjs(),
      typescript({ 
        tsconfig: './tsconfig.json',
        exclude: ['src/__tests__/**/*']
      }),
      babel({
        extensions,
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      terser(),
    ],
  },
  // 类型声明文件打包
  {
    input: 'src/index.ts',
    output: [{ file: pkg.types, format: 'es' }],
    plugins: [
      dts({
        exclude: ['src/__tests__/**/*']
      })
    ],
  },
];