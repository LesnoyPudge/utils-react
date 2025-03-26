import { shallowEqual } from '@lesnoypudge/utils';
import {
    ContextValue as ContextValueFluent,
    useContextSelector as useContextSelectorFluent,
    Context as ContextFluent,
} from '@fluentui/react-context-selector';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { ContextSelectable } from '@entities/ContextSelectable/ContextSelectable';
import { useFunction } from '@hooks/useFunction';
import { useContext, useRef } from 'react';



const EMPTY_VALUE = {};

const defaultSelector = <
    _Value,
    _Return = _Value,
>(v: _Value) => v as unknown as _Return;

export namespace useContextSelector {
    export type ContextSelectableSelector<
        _Value,
        _SelectedValue = _Value,
    > = (value: _Value) => _SelectedValue;
}

export const useContextSelector = <
    _Value extends T.UnknownRecord,
    _SelectedValue = _Value,
>(
    context: ContextSelectable.createContext.ContextSelectable<_Value>,
    selector: useContextSelector.ContextSelectableSelector<
        _Value,
        _SelectedValue
    > = defaultSelector,
    equalityFn = shallowEqual,
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