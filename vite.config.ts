import { defineConfig, UserConfigFn } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { checker } from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import path from 'node:path';
import url from 'node:url';
import { glob } from 'glob';



// https://vite.dev/config/
const config: UserConfigFn = () => {
    return defineConfig({
        build: {
            outDir: 'build',
            emptyOutDir: true,
            copyPublicDir: false,
            lib: {
                entry: 'src/index.ts',
                formats: ['es'],
            },
            rollupOptions: {
                external: [
                    'react',
                    'react/jsx-runtime',
                    '@lesnoypudge/utils',
                    '@lesnoypudge/utils-web',
                    'react-json-pretty',
                ],
                input: Object.fromEntries(
                    glob.sync('src/**/*.{ts,tsx}', {
                        ignore: ['src/**/*.d.ts'],
                    }).map((file) => [
                        path.relative(
                            'src',
                            file.slice(
                                0,
                                file.length - path.extname(file).length,
                            ),
                        ),
                        url.fileURLToPath(new URL(file, import.meta.url)),
                    ]),
                ),
                output: {
                    assetFileNames: 'assets/[name][extname]',
                    entryFileNames: '[name].js',
                },
            },
        },
        plugins: [
            tsconfigPaths(),
            checker({ typescript: true }),
            react({
                babel: {
                    plugins: [
                        [
                            '@babel/plugin-transform-react-jsx',
                            { runtime: 'automatic' },
                        ],
                        'jsx-control-statements',
                    ],
                },
            }),
            libInjectCss(),
            dts({ include: ['src'] }),
        ],
    });
};

export default config;