import { ContextSelectable, useContextProxy } from '@entities';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils';



type ContextConsumerProxyProps<
    _Value extends T.UnknownRecord,
> = (
    RT.PropsWithRenderFunction<[_Value]>
    & {
        context: ContextSelectable<_Value>;
    }
);

export const ContextConsumerProxy = <
    _Value extends T.UnknownRecord,
>({
    context,
    children,
}: ContextConsumerProxyProps<_Value>) => {
    const value = useContextProxy(context);

    return renderFunction(children, value);
};