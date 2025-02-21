import { T } from '@lesnoypudge/types-utils-base/namespace';
import { autoBind, catchErrorAsync, inRange, invariant, sleep } from '@lesnoypudge/utils';
import { ComponentType, lazy, LazyExoticComponent } from 'react';



// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BaseComponent = ComponentType<any>;

type WithDefault<_Component extends BaseComponent> = {
    default: _Component;
};

type ComponentPromise<_Component extends BaseComponent> = Promise<
    WithDefault<_Component>
>;

namespace withDelay {
    export type Options = {
        delay?: number;
        isDev?: boolean;
    };
}

const defaultBackoffFn = (count: number) => {
    return count * 2_000;
};

namespace asyncRetry {
    export type Options = {
        maxTriesCount?: number;
        backoffFn?: (count: number) => number;
    };
}

const asyncRetry = async <_Result,>(
    fn: () => Promise<_Result>,
    options?: asyncRetry.Options,
) => {
    const {
        backoffFn = defaultBackoffFn,
        maxTriesCount = 5,
    } = options ?? {};

    let result: _Result | undefined;

    for (let count = 0; count < maxTriesCount; count++) {
        await sleep(backoffFn(count));

        const [res] = await catchErrorAsync(fn);
        if (res) {
            result = res;
            count = maxTriesCount;
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
    createPreloadGroup(options?: asyncRetry.Options) {
        const promises: (() => ComponentPromise<BaseComponent>)[] = [];
        let result: (WithDefault<BaseComponent> | null)[] = [];

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

                        return await asyncRetry(promise, options) ?? null;
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

    /**
     * Creates a group of components that starts loading when
     * one of them is called.
     * Loading is resolved as soon as called component is loaded.
     * Other components is loaded in background.
     */
    createAsyncLoadGroup(options?: asyncRetry.Options) {
        const factories: (() => ComponentPromise<BaseComponent>)[] = [];
        const promises: (
            Promise<WithDefault<BaseComponent>> | null
        )[] = [];
        const result: (WithDefault<BaseComponent> | null)[] = [];

        const withAsyncLoadGroup = <_Component extends BaseComponent>(
            factory: () => ComponentPromise<_Component>,
        ): () => ComponentPromise<_Component> => {
            const currentIndex = factories.length;

            result[currentIndex] = null;
            factories.push(factory);

            return () => {
                const component = result[currentIndex];
                if (component) return Promise.resolve(
                    component as WithDefault<_Component>,
                );

                factories.forEach((_factory, index) => {
                    if (result[index]) return;
                    if (promises[index]) return;

                    const promise = asyncRetry(
                        _factory,
                        options,
                    ).then((maybeComponent) => {
                        if (result[index]) return result[index];
                        invariant(maybeComponent);

                        result[index] = maybeComponent;

                        return maybeComponent;
                    }).finally(() => {
                        promises[index] = null;
                    });

                    promises[index] = promise;
                });

                const promise = promises[currentIndex];
                invariant(promise);

                return promise as Promise<WithDefault<_Component>>;
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
        options?: withDelay.Options,
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
     * Original React.lazy will cache rejected state and
     * refuse to try to load again.
     * This version modifies how internal cache works by not
     * remembering rejected state.
     * Source of React.lazy: https://github.com/facebook/react/blob/main/packages/react/src/ReactLazy.js
     * Abandoned (2019) pull request with similar solution: https://github.com/facebook/react/pull/15296
     */
    modifiedReactLazy<_Component extends BaseComponent>(
        factory: () => ComponentPromise<_Component>,
    ): LazyExoticComponent<_Component> {
        // different implementation (as component)
        // const statuses = {
        //     Uninitialized: 'Uninitialized',
        //     Pending: 'Pending',
        //     Resolved: 'Resolved',
        //     Rejected: 'Rejected',
        // };
        // let status = statuses.Uninitialized;
        // let Result: _Component | Error | undefined;
        // let promise: ComponentPromise<_Component>;

        // const LazyComponentWrapper = (props: ComponentProps<_Component>) => {
        //     if (status === statuses.Uninitialized) {
        //         promise = factory();

        //         status = statuses.Pending;
        //         Result = undefined;

        //         void promise.then((value) => {
        //             status = statuses.Resolved;
        //             Result = value.default;
        //         }, (error) => {
        //             status = statuses.Rejected;
        //             Result = (
        //                 error instanceof Error
        //                     ? error
        //                     : new Error('Lazy-load failed')
        //             );
        //         });
        //     }

        //     if (status === statuses.Pending) {
        //         // eslint-disable-next-line @typescript-eslint/only-throw-error
        //         throw promise;
        //     }

        //     if (status === statuses.Resolved) {
        //         if (Result === undefined) never();
        //         if (Result instanceof Error) never();

        //         return (
        //             <Result {...props}/>
        //         );
        //     }

        //     if (status === statuses.Rejected) {
        //         if (!(Result instanceof Error)) never();
        //         const error = Result;

        //         setTimeout(() => {
        //             if (status !== statuses.Rejected) return;

        //             status = statuses.Uninitialized;
        //             Result = undefined;
        //         });

        //         throw error;
        //     }

        //     never();
        // };

        // return LazyComponentWrapper;

        const originalResult = lazy(factory) as (
            LazyExoticComponent<_Component> & {
                _payload: {
                    _status: -1 | 0 | 1 | 2;
                    _result: typeof factory | ReturnType<typeof factory>;
                };
                _init: T.AnyFunction;
            }
        );

        const Uninitialized = -1;
        const Rejected = 2;
        let rejectedTimeoutId: number;

        return {
            ...originalResult,
            // @ts-expect-error internals
            _init: (...args: unknown[]) => {
                if (originalResult._payload._status === Rejected) {
                    clearTimeout(rejectedTimeoutId);

                    // In case of rejection, react calls rejected component
                    // multiple times (4?).
                    // Since those calls are synchronous, we can mutate
                    // lazy-load result in timeout, so that when it called
                    // again it is treated as if it was just created.
                    rejectedTimeoutId = setTimeout(() => {
                        if (
                            originalResult._payload._status !== Rejected
                        ) return;

                        originalResult._payload._status = Uninitialized;
                        originalResult._payload._result = factory;
                    });
                }

                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return originalResult._init(...args);
            },
        };
    }

    /**
     * Wrapper for basic lazy component.
     */
    baseComponent<_Component extends BaseComponent>(
        fn: () => ComponentPromise<_Component>,
        options?: withDelay.Options,
    ) {
        return this.modifiedReactLazy(this.withDelay(fn, options));
    };

    /**
     * Creates predefined wrapper for preloaded components.
     */
    createBasePreloadedComponent(options?: {
        delay?: withDelay.Options;
        retry?: asyncRetry.Options;
    }) {
        const {
            withPreloadGroup,
        } = this.createPreloadGroup(options?.retry);

        return <_Component extends BaseComponent>(
            fn: () => ComponentPromise<_Component>,
        ) => {
            return this.modifiedReactLazy(withPreloadGroup(
                this.withDelay(fn, options?.delay),
            ));
        };
    };

    /**
     * Creates predefined wrapper for async components.
     */
    createBaseAsyncLoadedComponent(options?: {
        delay?: withDelay.Options;
        retry?: asyncRetry.Options;
    }) {
        const {
            withAsyncLoadGroup,
        } = this.createAsyncLoadGroup(options?.retry);

        return <_Component extends BaseComponent>(
            fn: () => ComponentPromise<_Component>,
        ) => {
            return this.modifiedReactLazy(withAsyncLoadGroup(
                this.withDelay(fn, options?.delay),
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