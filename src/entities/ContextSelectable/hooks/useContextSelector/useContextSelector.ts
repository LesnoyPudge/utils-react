import {
    ContextValue as ContextValueFluent,
    useContextSelector as useContextSelectorFluent,
    Context as ContextFluent,
} from '@fluentui/react-context-selector';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useFunction } from '@hooks/useFunction';
import { useContext, useRef } from 'react';
import { createContextSelectable } from '@entities/ContextSelectable/utils';



const EMPTY_VALUE = {};

const refEqual = (a: unknown, b: unknown): boolean => {
    return a === b;
};

export namespace useContextSelector {
    export type ContextSelectableSelector<
        _Value,
        _SelectedValue,
    > = (value: _Value) => _SelectedValue;
}

export const useContextSelector = <
    _Value extends T.UnknownRecord,
    _SelectedValue,
>(
    context: createContextSelectable.ContextSelectable<_Value>,
    selector: useContextSelector.ContextSelectableSelector<
        _Value,
        _SelectedValue
    >,
    equalityFn = refEqual,
): _SelectedValue => {
    const contextValue = useContext(
        context,
    ) as unknown as ContextValueFluent<_Value>;

    const prevSelectedRef = useRef<
        _SelectedValue
    >(EMPTY_VALUE as _SelectedValue);

    const stableSelector = useFunction(() => {
        const selected = selector(contextValue.value.current);

        if (equalityFn(selected, prevSelectedRef.current)) {
            return prevSelectedRef.current as _SelectedValue;
        }

        prevSelectedRef.current = selected;

        return selected;
    });

    return useContextSelectorFluent(
        context as ContextFluent<_Value>,
        stableSelector,
    );
};