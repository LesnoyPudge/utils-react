import { toPromise } from '@lesnoypudge/utils';
import { Types } from '../types';
import { REACT_LAZY_TYPE, Status } from '../vars';
import { LazyExoticComponent } from 'react';



type LazyComponent<
    _Component extends Types.BaseComponent,
> = {
    $$typeof: symbol | number;
    _payload: Types.Payload<_Component>;
    _init: (payload: Types.Payload<_Component>) => _Component;
};

const setGenericPayload = (
    payload: Types.Payload<Types.BaseComponent>,
    newPayload: Types.Payload<Types.BaseComponent>,
) => {
    payload._result = newPayload._result;
    payload._status = newPayload._status;
};

const setState = {
    resolved: (
        payload: Types.Payload<Types.BaseComponent>,
        _result: Types.ResolvedPayload<Types.BaseComponent>['_result'],
    ) => setGenericPayload(payload, {
        _result,
        _status: Status.Resolved,
    }),

    pending: (
        payload: Types.Payload<Types.BaseComponent>,
        _result: Types.PendingPayload['_result'],
    ) => setGenericPayload(payload, {
        _result,
        _status: Status.Pending,
    }),

    rejected: (
        payload: Types.Payload<Types.BaseComponent>,
        _result: Types.RejectedPayload['_result'],
    ) => setGenericPayload(payload, {
        _result,
        _status: Status.Rejected,
    }),

    uninitialized: (
        payload: Types.Payload<Types.BaseComponent>,
        _result: Types.UninitializedPayload<Types.BaseComponent>['_result'],
    ) => setGenericPayload(payload, {
        _result,
        _status: Status.Uninitialized,
    }),
};

const createLazyInitializer = <
    _Component extends Types.BaseComponent,
>({
    moduleOrPromiseFactory,
    promiseFactory,
}: {
    moduleOrPromiseFactory: Types.ModuleOrPromiseModuleFactory<_Component>;
    promiseFactory: Types.PromiseModuleFactory<_Component>;
}) => {
    let rejectedTimeoutId: number;

    const lazyInitializer = (
        payload: Types.Payload<_Component>,
    ): _Component => {
        if (payload._status === Status.Rejected) {
            clearTimeout(rejectedTimeoutId);

            // In case of rejection, react calls rejected component
            // multiple times (4?).
            // Since those calls are synchronous, we can mutate
            // lazy-load result in timeout, so that when it called
            // again it is treated as if it was just created.
            rejectedTimeoutId = setTimeout(() => {
                if (payload._status !== Status.Rejected) return;

                // Reset state.
                setState.uninitialized(payload, promiseFactory);
            });
        }

        if (payload._status === Status.Uninitialized) {
            const promiseOrModule = moduleOrPromiseFactory();
            const isPromise = promiseOrModule instanceof Promise;

            if (isPromise) {
                const onSuccess = (
                    moduleObject: Awaited<typeof promiseOrModule>,
                ) => {
                    const validStatuses = [
                        Status.Pending,
                        Status.Uninitialized,
                    ];
                    if (!validStatuses.includes(payload._status)) return;

                    // Transition to the next state.
                    setState.resolved(payload, moduleObject);
                };

                const onError = (error: unknown) => {
                    const validStatuses = [
                        Status.Pending,
                        Status.Uninitialized,
                    ];
                    if (!validStatuses.includes(payload._status)) return;

                    // Transition to the next state.
                    setState.rejected(payload, error);
                };

                // Transition to the next state.
                // This might throw either because it's missing or throws. If so, we treat it
                // as still uninitialized and try again next time. Which is the same as what
                // happens if the ctor or any wrappers processing the ctor throws. This might
                // end up fixing it if the resolution was a concurrency bug.
                promiseOrModule.then(onSuccess).catch(onError);
            }

            if (!isPromise) {
                // Transition to the next state.
                setState.resolved(payload, promiseOrModule);
            }

            const isUninitialized = payload._status === Status.Uninitialized;
            if (isUninitialized && isPromise) {
                // In case, we're still uninitialized, then we're waiting for the thenable
                // to resolve. Set it as pending in the meantime.
                setState.pending(payload, promiseOrModule);
            }
        }

        if (payload._status === Status.Resolved) {
            const moduleObject = payload._result;

            // component
            return moduleObject.default;
        } else {
            // promise or error
            throw payload._result;
        }
    };

    return lazyInitializer;
};


// https://github.com/facebook/react/blob/main/packages/react/src/ReactLazy.js
// https://github.com/facebook/react/pull/15296
export const modifiedReactLazy = <_Component extends Types.BaseComponent>(
    factory: Types.ModuleOrPromiseModuleFactory<_Component>,
): LazyExoticComponent<_Component> => {
    const promiseFactory = toPromise(factory);

    const payload: Types.Payload<_Component> = {
        // We use these fields to store the result.
        _status: Status.Uninitialized,
        _result: promiseFactory,
    };

    const lazyType: LazyComponent<_Component> = {
        $$typeof: REACT_LAZY_TYPE,
        _payload: payload,
        _init: createLazyInitializer({
            moduleOrPromiseFactory: factory,
            promiseFactory,
        }),
    };

    // cast to LazyExoticComponent due to some mismatch in
    // internal and external types.
    return lazyType as unknown as LazyExoticComponent<_Component>;
};