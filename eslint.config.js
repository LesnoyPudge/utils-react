import { config } from "@lesnoypudge/eslint-config";



const configArr = config.createConfig({
    rules: {
        '@stylistic/lines-between-class-members': 'off',
        '@stylistic/jsx-tag-spacing': 'off',
        '@stylistic/jsx-quotes': 'off',
        '@stylistic/max-len': ['warn', {
            'ignoreComments': true,
        }],
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/unbound-method': 'off',
        'unicorn/expiring-todo-comments': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'off',
        'unicorn/prefer-array-index-of': 'off',
        '@typescript-eslint/consistent-indexed-object-style': 'off',
        'promise/no-callback-in-promise': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    }
});

const _config = config.createConfig(
    config.mergeConfigs(
        config.configs.base,
        config.configs.react,
        config.configs.web,
        ...configArr,
    ),
    {
        ...config.configs.node,
        files: ['./src/**/*.test.ts']
    },
    config.configs.disableTypeChecked,
);

// writeFileSync(
//     'output.json',
//     JSON.stringify({..._config[0], plugins: []}, undefined, 4)
// )

export default _config;