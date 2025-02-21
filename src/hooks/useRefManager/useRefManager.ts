import { useConst } from '@hooks/useConst';
import { invariant, noop } from '@lesnoypudge/utils';
import { useRef } from 'react';



export namespace useRefManager {
    type MaybeCleanup = (() => void) | void | undefined;

    export type EffectCallback<_Value> = (value: _Value) => MaybeCleanup;

    export type EffectCleanup = () => void;

    export type Effect<_Value> = (
        callback: EffectCallback<_Value>
    ) => EffectCleanup;

    export type RefManager<_Value> = {
        current: _Value;
        effect: Effect<_Value>;
    };

    export type NullableRefManager<_Value> = {
        current: _Value | null;
        effect: Effect<_Value | null>;
    };

    export type Overload = {
        <_Value>(initialValue: _Value): RefManager<_Value>;

        <_Value>(initialValue: _Value | null): RefManager<_Value | null>;

        <_Value = undefined>(
            initialValue?: undefined
        ): RefManager<_Value | undefined>;
    };
}

/**
 * This hook provides an enhanced reference object (`RefManager`) that
 * triggers registered effects on value change.
 *
 * The `RefManager` object includes:
 * - `current`: Holds the current value of the ref.
 * - `effect`: A stable method to register effects that run
 * when the ref's value changes, returning a cleanup function.
 *
 * Example usage:
 *
 * ```tsx
 * const ExampleComponent: FC = () => {
 *     const refManager = useRefManager<HTMLButtonElement>(null);
 *     const [isVisible, setIsVisible] = useState(false);
 *
 *     useEffect(() => {
 *         // Effect registration
 *         return refManager.effect((buttonNode) => {
 *             if (!buttonNode) return;
 *
 *             const handler = () => {};
 *
 *             buttonNode.addEventListener('click', handler);
 *
 *             // Cleanup will be called on re-render
 *             // or value change
 *             return () => {
 *                 buttonNode.removeEventListener(
 *                     'click',
 *                     handler,
 *                 );
 *             };
 *         });
 *     }, [refManager]);
 *
 *     useEffect(() => {
 *         console.log(refManager.current); // null
 *
 *         const id = setTimeout(() => {
 *             setIsVisible(true);
 *         }, 3000);
 *
 *         return () => clearTimeout(id);
 *     }, []);
 *
 *     if (isVisible) {
 *         return (
 *             <button ref={refManager}>
 *                 <>Content</>
 *             </button>
 *         );
 *     }
 *
 *     return null;
 * };
 * ```
 */
export const useRefManager: useRefManager.Overload = (
    initialValue?: unknown,
): useRefManager.RefManager<unknown> => {
    const isInEffectRef = useRef(false);

    const effectCallbackToCleanup = useConst(() => {
        return new Map<
            useRefManager.EffectCallback<unknown>,
            useRefManager.EffectCleanup
        >();
    });

    const manager = useConst(() => {
        const throwIfRefChanged = (callback: VoidFunction) => {
            isInEffectRef.current = true;

            callback();

            isInEffectRef.current = false;
        };

        const rawManager: useRefManager.RefManager<unknown> = {
            current: initialValue,

            effect: (callback) => {
                throwIfRefChanged(() => {
                    effectCallbackToCleanup.set(
                        callback,
                        callback(rawManager.current) ?? noop,
                    );
                });

                return () => {
                    throwIfRefChanged(() => {
                        effectCallbackToCleanup.get(callback)?.();
                        effectCallbackToCleanup.delete(callback);
                    });
                };
            },
        };

        const notifyEffects = (value: unknown) => {
            throwIfRefChanged(() => {
                for (const [callback, cleanup] of effectCallbackToCleanup) {
                    cleanup();
                    effectCallbackToCleanup.set(callback, callback(value) ?? noop);
                }
            });
        };

        const proxy = new Proxy(rawManager, {
            set: (target, propertyKey, value: unknown, receiver) => {
                if (propertyKey === 'current') {
                    invariant(
                        !isInEffectRef.current,
                        'Cannot change value of ref manager during effect',
                    );

                    target.current = value;

                    notifyEffects(value);

                    return true;
                }

                return Reflect.set(target, propertyKey, value, receiver);
            },
        });

        return proxy;
    });

    return manager;
};

// const refTest1 = useRefManager();
// refTest1.current;
// //        ^?

// const refTest2 = useRefManager<number>();
// refTest2.current;
// //        ^?

// const refTest3 = useRefManager(2);
// refTest3.current;
// //        ^?

// const refTest4 = useRefManager<number>(2);
// refTest4.current;
// //        ^?

// const refTest5 = useRefManager<number>(null);
// refTest5.current;
// //        ^?

// const refTest6 = useRefManager<number>(undefined);
// refTest6.current;
// //        ^?