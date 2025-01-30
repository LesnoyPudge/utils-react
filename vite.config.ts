import { getViteLibraryConfig } from '@lesnoypudge/builder';
import { mergeConfig, UserConfig } from 'vite';



const {
    getBasePreparedConfig,
    extraPluginOptions,
    extraPlugins,
} = getViteLibraryConfig({
    importMetaUrl: import.meta.url,
    tsconfigPath: './tsconfig.react.build.json',
});

export default mergeConfig<UserConfig, UserConfig>(
    getBasePreparedConfig(),
    {
        plugins: [
            extraPlugins.libInjectCss(),
            extraPlugins.react(extraPluginOptions.react),
        ],
    },
);