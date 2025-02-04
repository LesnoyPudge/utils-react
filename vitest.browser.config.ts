import { defineConfig, defineWorkspace, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';



// export default mergeConfig(viteConfig, defineWorkspace([
//     {
//         extends: true,
//         test: {
//             name: 'node',
//             include: ['./src/**/*.node.test.*'],
//             environment: 'node',
//             globals: true,
//             mockReset: true,
//         },
//     },
//     {
//         extends: true,
//         test: {
//             name: 'browser',
//             setupFiles: ['./testUtils/testSetup.ts'],
//             globals: true,
//             mockReset: true,
//             include: ['./src/**/*.test.*'],
//             exclude: ['./src/**/*.node.test.*'],
//             browser: {
//                 enabled: true,
//                 headless: true,
//                 provider: 'playwright',
//                 screenshotFailures: false,
//                 instances: [
//                     { browser: 'chromium' },
//                     // { browser: 'firefox' },
//                     // { browser: 'webkit' },
//                 ],
//             },
//         },
//     },
// ]));

export default mergeConfig(viteConfig, defineConfig({
    test: {
        setupFiles: ['./testUtils/testSetup.ts'],
        globals: true,
        mockReset: true,
        include: ['./src/**/*.test.*'],
        exclude: ['./src/**/*.node.test.*'],
        fileParallelism: false,
        inspectBrk: true,
        inspector: {
            enabled: true,
            waitForDebugger: true,
        },
        poolOptions: {
            forks: {
                singleFork: true,
            },
        },
        browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            screenshotFailures: false,
            instances: [
                { browser: 'chromium' },
                // { browser: 'firefox' },
                // { browser: 'webkit' },
            ],
        },
    },
}));