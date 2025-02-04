import { defineWorkspace } from 'vitest/config';



export default defineWorkspace([
    {
        extends: './vite.config.ts',
        test: {
            name: 'node',
            include: ['./src/**/*.node.test.*'],
            environment: 'node',
            globals: true,
            mockReset: true,
            // inspector: {
            //     enabled: true,
            //     // waitForDebugger: true,
            // },
            // poolOptions: {
            //     forks: {
            //         singleFork: true,
            //     },
            // },
        },
    },
    {
        extends: './vite.config.ts',
        test: {
            name: 'browser',
            setupFiles: ['./testUtils/testSetup.ts'],
            globals: true,
            mockReset: true,
            // inspector: {
            //     enabled: true,
            //     // waitForDebugger: true,
            // },
            // poolOptions: {
            //     threads: {
            //         singleThread: true,
            //     },
            // },
            // poolOptions: {
            //     forks: {
            //         singleFork: true,
            //     },
            // },
            include: ['./src/**/*.test.*'],
            exclude: ['./src/**/*.node.test.*'],
            browser: {
                enabled: true,
                fileParallelism: false,
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
    },
]);