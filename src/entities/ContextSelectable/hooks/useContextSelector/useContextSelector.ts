import { shallowEqual } from '@lesnoypudge/utils';
import {
    ContextValue as ContextValueFluent,
    useContextSelector as useContextSelectorFluent,
    Context as ContextFluent,
} from '@fluentui/react-context-selector';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { defaultSelector } from '@utils/defaultSelector';
import { ContextSelectable } from '@entities/ContextSelectable';
import { useFunction } from '@hooks/useFunction';
import { useContext, useRef } from 'react';



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
    const contextValue = useContext(
        context,
    ) as unknown as ContextValueFluent<_Value>;

    const prevSelectedRef = useRef<
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