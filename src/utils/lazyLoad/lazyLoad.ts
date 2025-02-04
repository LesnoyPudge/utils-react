import { autoBind, catchErrorAsync, inRange, invariant, sleep } from '@lesnoypudge/utils';
import { ComponentType, lazy } from 'react';



// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BaseComponent = ComponentType<any>;

type WithDefault<_Component extends BaseComponent> = {
    default: _Component;
};

type ComponentPromise<_Component extends BaseComponent> = Promise<
    WithDefault<_Component>
>;

type WithDelayOptions = {
    delay?: number;
    isDev?: boolean;
};

const defaultDelayFn = (count: number) => {
    return count * 2_000;
};

const asyncRetry = async <_Result>(
    triesMaxCount: number,
    fn: () => Promise<_Result>,
    delayFn = defaultDelayFn,
) => {
    let result: _Result | undefined;

    for (let count = 0; count < triesMaxCount; count++) {
        await sleep(delayFn(count));

        const [res] = await catchErrorAsync(fn);
        console.log(`\nretry ${count}`, res, '\n');
        if (res) {
            result = res;
            count = triesMaxCount;
        }
    }

    return result;
};

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
    createPreloadGroup() {
        const promises: (() => ComponentPromise<BaseComponent>)[] = [];
        let result: (WithDefault<BaseComponent> | null)[] = [];
        const triesMaxCount = 5;

        const withPreloadGroup = <_Component extends BaseComponent>(
            fn: () => ComponentPromise<_Component>,
        ): () => ComponentPromise<_Component> => {
            const index = promises.length;
            result[index] = null;
            promises.push(fn);

            return async () => {
                const component = result[index];
                if (component) return component as WithDefault<_Component>;
                console.log('\nbefore', result, '\n');
                result = await Promise.all(
                    promises.map(async (promise, promiseIndex) => {
                        const alreadyLoaded = result[promiseIndex];
                        if (alreadyLoaded) return alreadyLoaded;

                        // const res = await promise();

                        console.log('\ncreate promise\n');

                        return await asyncRetry(triesMaxCount, promise) ?? null;
                    }),
                );

                const loadedComponent = result[index];
                console.log({ loadedComponent });
                invariant(loadedComponent);

                return loadedComponent as WithDefault<_Component>;
            };
        };

        return {
            withPreloadGroup,
        };
    };

    /**
     * Creates a group of components that starts loading when
     * one of them is called.
     * Loading is resolved as soon as called component is loaded.
     * Other components is loaded in background.
     */
    createAsyncLoadGroup() {
        const promises: (() => ComponentPromise<BaseComponent>)[] = [];
        const result: (WithDefault<BaseComponent> | null)[] = [];
        const triesMaxCount = 5;

        const withAsyncLoadGroup = <_Component extends BaseComponent>(
            fn: () => ComponentPromise<_Component>,
        ): () => ComponentPromise<_Component> => {
            const index = promises.length;
            result[index] = null;
            promises.push(fn);

            return async () => {
                const component = result[index];
                if (component) return component as WithDefault<_Component>;

                promises.forEach((promise, promiseIndex) => {
                    if (index === promiseIndex) return;
                    if (result[promiseIndex]) return;

                    void catchErrorAsync(promise).then(([maybeComponent]) => {
                        result[promiseIndex] = maybeComponent ?? null;
                    });
                });

                const loaded = await asyncRetry(triesMaxCount, fn) ?? null;
                result[index] = loaded;
                invariant(loaded);

                return loaded as WithDefault<_Component>;
            };
        };

        return {
            withAsyncLoadGroup,
        };
    };

    /**
     * Wraps a component loading function to add additional
     * delay before loading in dev mode.
     */
    withDelay<_Component extends BaseComponent>(
        fn: () => ComponentPromise<_Component>,
        options?: WithDelayOptions,
    ) {
        return async () => {
            const result = await fn();

            if (options?.isDev) {
                await sleep(options.delay ?? inRange(300, 500));
            }

            return result;
        };
    };

    /**
     * Re-export of 'React.lazy'
     */
    reactLazy = lazy;

    /**
     * Wrapper for basic lazy component.
     */
    baseComponent<_Component extends BaseComponent>(
        fn: () => ComponentPromise<_Component>,
        options?: WithDelayOptions,
    ) {
        return this.reactLazy(this.withDelay(fn, options));
    };

    /**
     * Creates predefined wrapper for preloaded components.
     */
    createBasePreloadedComponent() {
        const { withPreloadGroup } = this.createPreloadGroup();

        return <_Component extends BaseComponent>(
            fn: () => ComponentPromise<_Component>,
        ) => {
            return this.reactLazy(withPreloadGroup(this.withDelay(fn)));
        };
    };

    /**
     * Creates predefined wrapper for async components.
     */
    createBaseAsyncLoadedComponent() {
        const { withAsyncLoadGroup } = this.createAsyncLoadGroup();

        return <_Component extends BaseComponent>(
            fn: () => ComponentPromise<_Component>,
        ) => {
            return this.reactLazy(withAsyncLoadGroup(this.withDelay(fn)));
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