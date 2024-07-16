import tseslint from 'typescript-eslint';
import { eslintConfigBase } from '@lesnoypudge/eslint-base-config';
import { eslintConfigReact } from '@lesnoypudge/eslint-react-config';



export default tseslint.config(
    ...eslintConfigBase,
    ...eslintConfigReact,
    {
        rules: {
            '@stylistic/lines-between-class-members': 'off',
            '@stylistic/jsx-tag-spacing': 'off',
            '@stylistic/jsx-quotes': 'off',
            // 'object-curly-newline': ['warn', {
            //     // "ObjectExpression": "always",
            //     // "ObjectPattern": { "multiline": true },
            //     // "ImportDeclaration": {"multiline": true, "minq"},
            //     'ExportDeclaration': { 'multiline': true, 'minProperties': 3 },
            // }],
            '@stylistic/max-len': ['warn', {
                'ignoreComments': true,
            }],
            '@typescript-eslint/no-namespace': 'off',
        },
    },
);