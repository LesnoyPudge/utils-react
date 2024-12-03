import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';
import React from 'react';



type ContextConsumerProps<_Value> = (
    RT.PropsWithRenderFunctionOrNode<[_Value]>
    & {
        context: React.Context<_Value>;
    }
);

export const ContextConsumer = <_Value,>({
    context,
    children,
}: ContextConsumerProps<_Value>) => {
    const value = React.useContext(context);

    return renderFunction(children, value);
};