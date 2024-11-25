import { useConst } from '@hooks/useConst';
import { useFunction } from '@hooks/useFunction';
import { useUnmountEffect } from '@hooks/useUnmountEffect';
import { noop } from '@lesnoypudge/utils';
import { isRef } from '@utils/isRef';
import { RefCallback } from 'react';

type MutableRefObject<_Value> = {
    current: _Value;
};

export namespace useRefManager {
    export type SettablePossibleRef<_Value> = (
        MutableRefObject<_Value>
        | RefManager<_Value>
    );

    export type OptionalSettablePossibleRef<_Value> = (
        SettablePossibleRef<_Value>
        | null
        | undefined
    );

    export type PossibleRef<_Value> = (
        SettablePossibleRef<_Value>
        | RefCallback<_Value>
    );

    export type OptionalPossibleRef<_Value> = (
        PossibleRef<_Value>
        | null
        | undefined
    );

    // export type Subscribe<
    //     _Value,
    // > = (
    //     ...refs: PossibleRef<_Value>[]
    // ) => RefManager<_Value>;

    export type EffectCleanup = () => void;

    export type EffectCallback<_Value> = (
        ((value: _Value) => EffectCleanup)
        | ((value: _Value) => void)
    );

    export type Effect<_Value> = (
        callback: EffectCallback<_Value>
    ) => EffectCleanup;

    export type RefManager<_Value> = {
        current: _Value | null;
        // subscribe: Subscribe<_Value>;
        effect: Effect<_Value>;
    };

    export type Args<_Value> = [
        initialValue: _Value | null,
        ...initialSubscribedRefs: useRefManager.OptionalPossibleRef<_Value>[],
    ];
}

/**
 * This hook provides an enhanced reference object (`RefManager`) that can:
 * - Manage multiple refs, including mutable ref objects, ref callbacks, and other RefManager instances.
 * - Apply and manage side effects when the ref's value changes.
 * - Provide a proxy to handle reactive updates to the `current` value.
 *
 * The `RefManager` object includes:
 * - `current`: Holds the current value of the ref.
 * - `effect`: A stable method to register effects that run when the ref's value changes, returning a cleanup function.
 *
 * Example usage:
 *
 * ```tsx
 * const MyComponent: React.FC = () => {
 *   const refManager = useRefManager<HTMLButtonElement>(null);
 *   const ref1 = useRef<HTMLButtonElement>(null);
 *   const ref2 = useRef<HTMLButtonElement>(null);
 *
 *   useEffect(() => {
 *     // Effect will be called when a node is provided to ref
 *     return refManager.effect((buttonNode) => {
 *       const handler = () => {};
 *       buttonNode.addEventListener('click', handler);
 *
 *       // Cleanup will be called on unmount or
 *       // when null is provided to ref
 *       return () => {
 *         buttonNode.removeEventListener(
*              'click',
*              handler
*          );
 *       };
 *     });
 *   }, [refManager]);
 *
 *   useEffect(() => {
 *     // ref1 and ref2 are button refs
 *     console.log(ref1, ref2);
 *   }, []);
 *
 *   return (
 *     <button ref={refManager.subscribe(ref1, ref2)}>
 *       <>Content</>
 *     </button>
 *   );
 * };
 * ```
 */
export const useRefManager = <_Value>(...[
    initialValue,
    ...initialSubscribedRefs
]: useRefManager.Args<_Value>): useRefManager.RefManager<_Value> => {
    const subscribedRefs = useConst(() => {
        return new Map<useRefManager.PossibleRef<_Value>, _Value | null>();
    });

    const effectCallbackToCleanup = useConst(() => {
        return new Map<
            useRefManager.EffectCallback<_Value>,
            useRefManager.EffectCleanup
        >();
    });

    const notifySubscribedRefs = useFunction((value: _Value | null) => {
        for (const [subscribedRef] of subscribedRefs) {
            if (isRef(subscribedRef)) {
                subscribedRef.current = value;
                continue;
            }

            subscribedRef(value);
        }
    });

    const notifyEffects = useFunction((value: _Value | null) => {
        if (value === null) {
            for (const [callback, cleanup] of effectCallbackToCleanup) {
                cleanup();
                effectCallbackToCleanup.set(callback, noop);
            }

            return;
        }

        for (const [callback] of effectCallbackToCleanup) {
            effectCallbackToCleanup.set(callback, callback(value) || noop);
        }
    });

    const update = useFunction((value: _Value | null) => {
        notifySubscribedRefs(value);
        notifyEffects(value);
    });

    const manager = useConst(() => {
        const rawManager: useRefManager.RefManager<_Value> = {
            current: initialValue,

            // subscribe: (...refs) => {
            //     refs.forEach((refToSubscribe) => {
            //         subscribedRefs.set(refToSubscribe, rawManager.current);
            //     });

            //     return manager;
            // },

            effect: (callback) => {
                const value = rawManager.current;

                effectCallbackToCleanup.set(
                    callback,
                    value === null ? noop : (callback(value) || noop),
                );

                return () => {
                    effectCallbackToCleanup.get(callback)?.();
                    effectCallbackToCleanup.delete(callback);
                };
            },
        };

        initialSubscribedRefs.filter(Boolean).forEach((refToSubscribe) => {
            subscribedRefs.set(refToSubscribe, rawManager.current);
        });

        notifySubscribedRefs(rawManager.current);

        const proxy = new Proxy(rawManager, {
            set: (target, propertyKey, value: _Value | null, receiver) => {
                if (propertyKey === 'current') {
                    target.current = value;

                    update(value);

                    return true;
                }

                return Reflect.set(target, propertyKey, value, receiver);
            },
        });

        return proxy;
    });

    useUnmountEffect(() => {
        effectCallbackToCleanup.forEach((cleanup) => cleanup());
        effectCallbackToCleanup.clear();
        subscribedRefs.clear();
    });

    return manager;
};