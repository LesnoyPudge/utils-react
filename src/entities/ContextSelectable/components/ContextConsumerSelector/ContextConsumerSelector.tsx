import { ContextSelectable } from '@entities/ContextSelectable';
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
            context: ContextSelectable.createContext.ContextSelectable<_Value>;
            selector?: ContextSelectable.useSelector.ContextSelectableSelector<
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
    const value = ContextSelectable.useSelector(context, selector);

    return renderFunction(children, value);
};