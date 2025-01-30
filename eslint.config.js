import { config } from '@lesnoypudge/eslint-config';



const _config = config.createConfig(
    config.configs.base,
    config.configs.react,
    config.configs.web,
    {
        ...config.configs.node,
        files: ['./src/**/*.test.ts'],
    },
    config.configs.disableTypeChecked,
);

export default _config;