import { catchErrorAsync, inRange, invariant, sleep } from '@lesnoypudge/utils';
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

        if (res) {
            result = res;
            count = triesMaxCount;
        }
    }

    return result;
};

class LazyLoad {
    createPreloadGroup = () => {
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

                result = await Promise.all(
                    promises.map(async (promise, promiseIndex) => {
                        const alreadyLoaded = result[promiseIndex];
                        if (alreadyLoaded) return alreadyLoaded;

                        return await asyncRetry(triesMaxCount, promise) ?? null;
                    }),
                );

                const loadedComponent = result[index];
                invariant(loadedComponent);

                return loadedComponent as WithDefault<_Component>;
            };
        };

        return {
            withPreloadGroup,
        };
    };

    createAsyncLoadGroup = () => {
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

    withDelay = <_Component extends BaseComponent>(
        fn: () => ComponentPromise<_Component>,
        options?: WithDelayOptions,
    ) => {
        return async () => {
            if (options?.isDev) {
                await sleep(options.delay ?? inRange(300, 500));
            }

            return fn();
        };
    };

    reactLazy = lazy;

    baseComponent = <_Component extends BaseComponent>(
        fn: () => ComponentPromise<_Component>,
        options?: WithDelayOptions,
    ) => {
        return this.reactLazy(this.withDelay(fn, options));
    };

    createBasePreloadedComponent = () => {
        const { withPreloadGroup } = this.createPreloadGroup();

        return <_Component extends BaseComponent>(
            fn: () => ComponentPromise<_Component>,
        ) => {
            return this.reactLazy(withPreloadGroup(this.withDelay(fn)));
        };
    };

    createBaseAsyncLoadedComponent = () => {
        const { withAsyncLoadGroup } = this.createAsyncLoadGroup();

        return <_Component extends BaseComponent>(
            fn: () => ComponentPromise<_Component>,
        ) => {
            return this.reactLazy(withAsyncLoadGroup(this.withDelay(fn)));
        };
    };

    basePreloadedComponent = this.createBasePreloadedComponent();

    baseAsyncComponent = this.createBaseAsyncLoadedComponent();
}

// eslint-disable-next-line @typescript-eslint/no-misused-spread
export const lazyLoad = { ...new LazyLoad() };