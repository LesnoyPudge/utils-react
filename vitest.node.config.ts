import { mergeConfig, UserWorkspaceConfig } from 'vitest/config';
import viteConfig from './vite.config';



export const nodeConfig = {
    test: {
        name: 'node',
        include: ['./src/**/*.node.test.*'],
        environment: 'node',
        globals: true,
        mockReset: true,
        // inspectBrk: true,
        // poolOptions: {
        //     forks: {
        //         singleFork: true,
        //     },
        // },
        // fileParallelism: false,
    },
} satisfies UserWorkspaceConfig;

export default mergeConfig(viteConfig, nodeConfig);