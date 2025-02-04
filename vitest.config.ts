import { defineConfig, defineWorkspace, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';



const config = mergeConfig(viteConfig, defineConfig({
    test: {
        name: 'browser',
        setupFiles: ['./testUtils/testSetup.ts'],
        globals: true,
        mockReset: true,
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
}));

export default config;