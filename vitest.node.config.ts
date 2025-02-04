import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';



export default mergeConfig(viteConfig, defineConfig({
    test: {
        name: 'node',
        include: ['./src/**/*.node.test.*'],
        environment: 'node',
        globals: true,
        mockReset: true,
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
        fileParallelism: false,
    },
}));