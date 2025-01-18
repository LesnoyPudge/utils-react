import { pick, shallowEqual } from '@lesnoypudge/utils';
import {
    useContextSelector as useContextSelectorFluent,
    Context as ContextFluent,
} from '@fluentui/react-context-selector';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { ContextSelectable } from '@entities/ContextSelectable';
import { useConst } from '@hooks/useConst';
import { useFunction } from '@hooks/useFunction';
import { useMemo, useRef } from 'react';



const EMPTY_VALUE = Symbol.for('EMPTY_VALUE');

export const useContextProxy = <
    _Value extends T.UnknownRecord,
>(
    context: ContextSelectable<_Value>,
): _Value => {
    const usedKeys = useConst(() => new Set<PropertyKey>());
    const prevSelectedValueRef = useRef<
        _Value | typeof EMPTY_VALUE
    >(EMPTY_VALUE);

    const selector = useFunction((value: _Value | undefined) => {
        if (value === undefined) return value;

        const prev = prevSelectedValueRef;

        if (prev.current === EMPTY_VALUE) {
            prev.current = value;
            return value;
        }

        if (usedKeys.size === 0) {
            return prev.current;
        }

        const usedKeysList = [...usedKeys.values()];

        const newUsedValue = pick(value, ...usedKeysList);

        const prevUsedValue = pick(prev.current, ...usedKeysList);

        if (shallowEqual(newUsedValue, prevUsedValue)) {
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

    const memoizedValue = useMemo(() => {
        if (value === undefined) return value;

        return new Proxy(value, proxyHandler);
    }, [value, proxyHandler]);

    return memoizedValue as unknown as _Value;
};