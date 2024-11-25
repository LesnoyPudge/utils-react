import {
    ContextSelectable,
    ContextSelectableSelector,
    useContextSelector,
} from '@entities/ContextSelectable';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';



type ContextConsumerSelectorProps<
    _Value extends T.UnknownRecord,
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

export const ContextConsumerSelector = <
    _Value extends T.UnknownRecord,
    _SelectedValue = _Value,
>({
    context,
    selector,
    children,
}: ContextConsumerSelectorProps<_Value, _SelectedValue>) => {
    const value = useContextSelector(context, selector);

    return renderFunction(children, value);
};