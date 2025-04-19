import { T } from '@lesnoypudge/types-utils-base/namespace';
import { createContextSelectable } from '@entities/ContextSelectable/utils';
import { useContextSelector } from '@entities/ContextSelectable/hooks';



export namespace createUseContextSelectorHook {
    export type Return<
        _Value extends T.UnknownRecord,
    > = <
        _SelectedValue,
    >(
        selector: useContextSelector.ContextSelectableSelector<
            _Value,
            _SelectedValue
        >
    ) => _SelectedValue;
}

export const createUseContextSelectorHook = <
    _Value extends T.UnknownRecord,
>(
    context: createContextSelectable.ContextSelectable<_Value>,
): createUseContextSelectorHook.Return<_Value> => {
    return (selector) => {
        return useContextSelector(context, selector);
    };
};