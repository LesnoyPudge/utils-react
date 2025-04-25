import {
    autoBind,
    inRange,
    invariant,
    sleep,
} from '@lesnoypudge/utils';
import { modifiedReactLazy, asyncRetry } from './utils';
import { Types } from './types';



class LazyLoad {
    constructor() {
        autoBind(this);
    }

    /**
     * Creates a group of components that is loaded together
     * when one of them is called.
     * Loading is resolved when all components is loaded.
     * Throws error if called component is failed to load.
     */
    createPreloadGroup(
        options?: Types.createPreloadGroup.Options,
    ): Types.createPreloadGroup.Return {
        const promiseFactoryList: Types.PromiseModuleFactory<
            Types.BaseComponent
        >[] = [];

        const resolvedModules: (
            Types.Module<Types.BaseComponent> | null
        )[] = [];

        const promisesInWork: (
            Promise<Types.Module<Types.BaseComponent> | null> | null
        )[] = [];

        const trigger = async () => {
            const promisesToAwait = promiseFactoryList.map(
                async (promiseFactory, index) => {
                    const alreadyLoaded = resolvedModules[index];
                    if (alreadyLoaded) return alreadyLoaded;

                    const alreadyResolving = promisesInWork[index];
                    if (alreadyResolving) return alreadyResolving;

                    const modulePromise = asyncRetry(
                        promiseFactory,
                        options,
                    ).then((v) => v ?? null);

                    promisesInWork[index] = modulePromise;

                    return await modulePromise;
                },
            );

            const results = await Promise.all(promisesToAwait);

            results.forEach((result, index) => {
                resolvedModules[index] = result;
                promisesInWork[index] = null;
            });
        };

        const withPreloadGroup: (
            Types.createPreloadGroup.PreloadGroupWrapper
        ) = (factory) => {
            const index = promiseFactoryList.length;

            resolvedModules[index] = null;
            promiseFactoryList[index] = factory;

            const moduleOrPromiseModuleFactory = () => {
                const module = resolvedModules[index];
                if (module) return module as Types.Module<Types.BaseComponent>;

                return new Promise<
                    Types.Module<Types.BaseComponent>
                >((res, rej) => {
                    const asyncBody = async () => {
                        await trigger();

                        const loadedComponent = resolvedModules[index];
                        invariant(loadedComponent, 'Failed to lazy load.');

                        return loadedComponent as (
                            Types.Module<Types.BaseComponent>
                        );
                    };

                    asyncBody().then(res).catch(rej);
                }) as Types.PromiseModule<Types.BaseComponent>;
            };

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
            return moduleOrPromiseModuleFactory as any;
        };

        return {
            withPreloadGroup,
            trigger,
        };
    };

    /**
     * Creates a group of components that starts loading when
     * one of them is called.
     * Loading is resolved as soon as called component is loaded.
     * Other components is loaded in background.
     */
    createAsyncLoadGroup(options?: Types.asyncRetry.Options) {
        const promiseFactoryList: Types.PromiseModuleFactory<
            Types.BaseComponent
        >[] = [];

        const resolvedModules: (
            Types.Module<Types.BaseComponent> | null
        )[] = [];

        const promises: (
            Promise<Types.Module<Types.BaseComponent> | null> | null
        )[] = [];

        const withAsyncLoadGroup = <_Component extends Types.BaseComponent>(
            factory: Types.PromiseModuleFactory<_Component>,
        ): Types.ModuleOrPromiseModuleFactory<_Component> => {
            const currentIndex = promiseFactoryList.length;

            resolvedModules[currentIndex] = null;
            promiseFactoryList[currentIndex] = factory;

            const moduleOrPromiseModuleFactory = () => {
                const module = resolvedModules[currentIndex];
                if (module) return module;

                promiseFactoryList.forEach((promiseModuleFactory, index) => {
                    if (resolvedModules[index]) return;
                    if (promises[index]) return;

                    const promise = asyncRetry(
                        promiseModuleFactory,
                        options,
                    ).then((maybeComponent) => {
                        if (!maybeComponent) return null;

                        resolvedModules[index] = maybeComponent;

                        return maybeComponent ?? null;
                    }).finally(() => {
                        promises[index] = null;
                    });

                    promises[index] = promise;
                });

                return new Promise<
                    Types.Module<Types.BaseComponent>
                >((res, rej) => {
                    const asyncBody = async () => {
                        const module = await promises[currentIndex];
                        invariant(module);

                        return module;
                    };

                    asyncBody().then(res).catch(rej);
                });
            };

            return moduleOrPromiseModuleFactory as Types.ModuleOrPromiseModuleFactory<_Component>;
        };

        return {
            withAsyncLoadGroup,
        };
    };

    /**
     * Wraps a component loading function to add additional
     * delay before loading in dev mode.
     */
    withDelay<_Component extends Types.BaseComponent>(
        factory: Types.PromiseModuleFactory<_Component>,
        options?: Types.withDelay.Options,
    ) {
        return async () => {
            const result = await factory();

            if (options?.enable) {
                await sleep(options.delay ?? inRange(300, 500));
            }

            return result;
        };
    };

    /**
     * Original React.lazy will cache rejected state and
     * refuse to try to load again.
     * This version modifies how internal cache works by not
     * remembering rejected state.
     * Source of React.lazy: https://github.com/facebook/react/blob/main/packages/react/src/ReactLazy.js
     * Abandoned (2019) pull request with similar solution: https://github.com/facebook/react/pull/15296
     */
    modifiedReactLazy = modifiedReactLazy;

    /**
     * Wrapper for basic lazy component.
     */
    baseComponent<_Component extends Types.BaseComponent>(
        factory: Types.PromiseModuleFactory<_Component>,
        options?: Types.withDelay.Options,
    ) {
        return this.modifiedReactLazy(this.withDelay(factory, options));
    };

    /**
     * Creates predefined wrapper for preloaded components.
     */
    createBasePreloadedComponent(
        options?: Types.createBasePreloadedComponent.Options,
    ): Types.createBasePreloadedComponent.Return {
        const {
            withPreloadGroup,
            trigger,
        } = this.createPreloadGroup(options?.retry);

        const load: Types.createBasePreloadedComponent.LoadFn = (
            factory,
        ) => {
            return this.modifiedReactLazy(withPreloadGroup(
                this.withDelay(factory, options?.delay),
            ));
        };

        return {
            trigger,
            load,
        };
    };

    /**
     * Creates predefined wrapper for async components.
     */
    createBaseAsyncLoadedComponent(options?: {
        delay?: Types.withDelay.Options;
        retry?: Types.asyncRetry.Options;
    }) {
        const {
            withAsyncLoadGroup,
        } = this.createAsyncLoadGroup(options?.retry);

        return <_Component extends Types.BaseComponent>(
            factory: Types.PromiseModuleFactory<_Component>,
        ) => {
            return this.modifiedReactLazy(withAsyncLoadGroup(
                this.withDelay(factory, options?.delay),
            ));
        };
    };

    /**
     * Predefined wrapper for preloaded components.
     */
    basePreloadedComponent = this.createBasePreloadedComponent();

    /**
     * Predefined wrapper for async components.
     */
    baseAsyncComponent = this.createBaseAsyncLoadedComponent();
}

/**
 * Utility functions for managing lazy-loaded components.
 */
export const lazyLoad = new LazyLoad();