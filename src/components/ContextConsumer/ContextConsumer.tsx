import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@root';
import React from 'react';



type ContextConsumerProps<_Value> = (
    RT.PropsWithRenderFunction<[_Value]>
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