import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { ReactNode } from 'react';



/**
 * Executes the render function with provided arguments or returns the
 * children directly if it's not a function.
 */
export const renderFunction = <_Args extends unknown[]>(
    children: RT.RenderFunction<_Args> | ReactNode,
    ...args: _Args
): ReactNode => {
    return typeof children === 'function' ? children(...args) : children;
};