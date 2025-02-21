import { defineConfig, defineWorkspace, mergeConfig } from 'vitest/config';
import { browserConfig } from './vitest.browser.config';
import { nodeConfig } from './vitest.node.config';



export default defineWorkspace([
    {
        extends: './vite.config.ts',
        ...browserConfig,
        // ...mergeConfig(
        //     browserConfig,
        // defineConfig({
        //     test: {
        //         browser: {
        //             instances: [
        //                 { browser: 'firefox' },
        //                 { browser: 'webkit' },
        //             ],
        //         },
        //     },
        // }),
        // ),
    },
    {
        extends: './vite.config.ts',
        ...nodeConfig,
    },
]);