import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { ReactNode } from 'react';



export const renderFunction = <_Args extends unknown[]>(
    children: RT.RenderFunction<_Args> | ReactNode,
    ...args: _Args
): ReactNode => {
    return typeof children === 'function' ? children(...args) : children;
};