import { RT } from '@lesnoypudge/types-utils-react/namespace';
import {
    ContextSelectable, ContextSelectableSelector,
    renderFunction, useContextSelectable,
} from '@root';



type ContextSelectableConsumerProps<
    _Value,
    _SelectedValue = _Value,
> = (
    RT.PropsWithRenderFunction<[_SelectedValue]>
    & {
        context: ContextSelectable<_Value>;
        selector?: ContextSelectableSelector<
            _Value,
            _SelectedValue
        >;
    }
);

export const ContextSelectableConsumer = <
    _Value,
    _SelectedValue = _Value,
>({
    context,
    selector,
    children,
}: ContextSelectableConsumerProps<_Value, _SelectedValue>) => {
    const value = useContextSelectable(context, selector);

    return renderFunction(children, value);
};