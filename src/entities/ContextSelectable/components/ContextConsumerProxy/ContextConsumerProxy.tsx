import { ContextSelectable } from '@entities/ContextSelectable/ContextSelectable';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';



export namespace ContextConsumerProxy {
    export type Props<
        _Value extends T.UnknownRecord,
    > = (
        RT.PropsWithRenderFunctionOrNode<[_Value]>
        & {
            context: ContextSelectable.createContext.ContextSelectable<_Value>;
        }
    );
}

export const ContextConsumerProxy = <
    _Value extends T.UnknownRecord,
>({
    context,
    children,
}: ContextConsumerProxy.Props<_Value>) => {
    const value = ContextSelectable.useProxy(context);

    return renderFunction(children, value);
};