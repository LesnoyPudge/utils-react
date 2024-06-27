import { pick, shallowEqual } from '@lesnoypudge/utils';
import { ContextSelectable, useConst } from '@root';
import React, { useMemo } from 'react';
import {
    useContextSelector as useContextSelectorFluent,
    Context as ContextFluent,
} from '@fluentui/react-context-selector';
import { T } from '@lesnoypudge/types-utils-base/namespace';



const EMPTY_VALUE = Symbol.for('empty-state');

export const useContextProxy = <
    _Value extends T.UnknownRecord,
>(
    context: ContextSelectable<_Value>,
): _Value => {
    const usedKeys = useConst(() => new Set<PropertyKey>());
    const prevSelectedValueRef = React.useRef<
        _Value | typeof EMPTY_VALUE
    >(EMPTY_VALUE);

    const selector = useConst(() => (value: _Value) => {
        const prev = prevSelectedValueRef;

        if (prev.current === EMPTY_VALUE) {
            prev.current = value;
            return value;
        }

        if (usedKeys.size === 0) {
            return prev.current;
        }

        const usedKeysList = Array.from(usedKeys.values());

        // @ts-expect-error
        const newUsedValue = pick(value, ...usedKeysList);
        // @ts-expect-error
        const prevUsedValue = pick(prev.current, ...usedKeysList);

        if (shallowEqual(newUsedValue, prevUsedValue)) {
            // prev.current = Object.assign(stableObject, value, newUsedValue);
            return prev.current;
        }

        prev.current = value;

        return value;
    });

    const value = useContextSelectorFluent(
        context as ContextFluent<_Value>,
        selector,
    );

    const proxyHandler = useConst<ProxyHandler<_Value>>(() => ({
        get: (target, p, receiver) => {
            if (Object.hasOwn(target, p)) {
                usedKeys.add(p);
            }

            return Reflect.get(target, p, receiver);
        },
    }));

    // const prevUsedKeysSizeRef = useRef<number | null>(null);

    const memoizedValue = useMemo(() => {
        return new Proxy(value, proxyHandler);

        // if (prevUsedKeysSizeRef.current === null) {
        //     prevUsedKeysSizeRef.current = 0;
        //     return new Proxy(value, proxyHandler) as _Value;
        // }

        // if (usedKeys.size === prevUsedKeysSizeRef.current) {
        //     return value;
        // }

        // prevUsedKeysSizeRef.current = usedKeys.size;

        // return new Proxy(value, proxyHandler) as _Value;
    }, [proxyHandler, value]);

    return memoizedValue;
};