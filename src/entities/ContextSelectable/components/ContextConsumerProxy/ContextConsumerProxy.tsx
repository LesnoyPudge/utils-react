import {
    useContextProxy,
    ContextSelectable,
} from '@entities/ContextSelectable';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';



export namespace ContextConsumerProxy {
    export type Props<
        _Value extends T.UnknownRecord,
    > = (
        RT.PropsWithRenderFunctionOrNode<[_Value]>
        & {
            context: ContextSelectable<_Value>;
        }
    );
}

export const ContextConsumerProxy = <
    _Value extends T.UnknownRecord,
>({
    context,
    children,
}: ContextConsumerProxy.Props<_Value>) => {
    const value = useContextProxy(context);

    return renderFunction(children, value);
};