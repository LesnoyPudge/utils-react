import { RT } from '@lesnoypudge/types-utils-react/namespace';
import React from 'react';



export const renderFunction = <_Args extends unknown[]>(
    children: RT.RenderFunction<_Args> | React.ReactNode,
    ...args: _Args
): React.ReactNode => {
    return typeof children === 'function' ? children(...args) : children;
};