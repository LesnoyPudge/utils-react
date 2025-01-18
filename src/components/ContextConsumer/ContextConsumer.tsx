import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';
import { Context, useContext } from 'react';



type ContextConsumerProps<_Value> = (
    RT.PropsWithRenderFunctionOrNode<[_Value]>
    & {
        context: Context<_Value>;
    }
);

export const ContextConsumer = <_Value,>({
    context,
    children,
}: ContextConsumerProps<_Value>) => {
    const value = useContext(context);

    return renderFunction(children, value);
};