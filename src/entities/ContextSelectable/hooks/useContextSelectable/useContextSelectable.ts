import { shallowEqual } from '@lesnoypudge/utils';
import { ContextSelectable, defaultSelector } from '@root';
import React from 'react';
import {
    ContextValue as ContextValueFluent,
    useContextSelector as useContextSelectorFluent,
    Context as ContextFluent,
} from '@fluentui/react-context-selector';

export type ContextSelectableSelector<
    _Value,
    _SelectedValue = _Value,
> = (value: _Value) => _SelectedValue;

export const useContextSelectable = <
    _Value,
    _SelectedValue = _Value,
>(
    context: ContextSelectable<_Value>,
    selector: ContextSelectableSelector<
        _Value,
        _SelectedValue
    > = defaultSelector,
): _SelectedValue => {
    const contextValue = React.useContext(
        context,
    ) as ContextValueFluent<_Value>;
    const selected = selector(contextValue.value.current);
    const prevSelectedRef = React.useRef(selected);
    const selectorRef = React.useRef(() => prevSelectedRef.current);

    if (!shallowEqual(prevSelectedRef.current, selected)) {
        prevSelectedRef.current = selected;
    }

    return useContextSelectorFluent(
        context as ContextFluent<_Value>,
        selectorRef.current,
    );
};