import { shallowEqual } from '@lesnoypudge/utils';
import React from 'react';
import {
    ContextValue as ContextValueFluent,
    useContextSelector as useContextSelectorFluent,
    Context as ContextFluent,
} from '@fluentui/react-context-selector';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { defaultSelector } from '@utils';
import { ContextSelectable } from '@entities';
import { useFunction } from '@hooks';



export type ContextSelectableSelector<
    _Value,
    _SelectedValue = _Value,
> = (value: _Value) => _SelectedValue;

const EMPTY_VALUE = Symbol.for('EMPTY_VALUE');

export const useContextSelector = <
    _Value extends T.UnknownRecord,
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
    ) as unknown as ContextValueFluent<_Value>;

    const prevSelectedRef = React.useRef<
        _SelectedValue | typeof EMPTY_VALUE
    >(EMPTY_VALUE);

    const stableSelector = useFunction(() => {
        const selected = selector(contextValue.value.current);

        if (shallowEqual(selected, prevSelectedRef.current)) {
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