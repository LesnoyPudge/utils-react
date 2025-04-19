import { useContextSelector } from '@entities/ContextSelectable/hooks';
import { createContextSelectable } from '@entities/ContextSelectable/utils';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';



export namespace ContextConsumerSelector {
    export type Props<
        _Value extends T.UnknownRecord,
        _SelectedValue = _Value,
    > = (
        RT.PropsWithRenderFunctionOrNode<[_SelectedValue]>
        & {
            context: createContextSelectable.ContextSelectable<_Value>;
            selector: useContextSelector.ContextSelectableSelector<
                _Value,
                _SelectedValue
            >;
        }
    );
}

export const ContextConsumerSelector = <
    _Value extends T.UnknownRecord,
    _SelectedValue = _Value,
>({
    context,
    selector,
    children,
}: ContextConsumerSelector.Props<_Value, _SelectedValue>) => {
    const value = useContextSelector(context, selector);

    return renderFunction(children, value);
};