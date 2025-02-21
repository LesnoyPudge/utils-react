import { mergeConfig, UserWorkspaceConfig } from 'vitest/config';
import viteConfig from './vite.config';



export const browserConfig = {
    test: {
        name: 'browser',
        setupFiles: ['./testUtils/testSetup.ts'],
        globals: true,
        mockReset: true,
        // fileParallelism: false,
        // inspectBrk: true,
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
                { browser: 'firefox' },
                { browser: 'webkit' },
            ],
        },
    },
} satisfies UserWorkspaceConfig;

export default mergeConfig(viteConfig, browserConfig);