import { T } from '@lesnoypudge/types-utils-base/namespace';
import { FC } from 'react';



export const withDisplayName = <
    _Component extends T.AnyFunction,
>(
    displayName: string,
    component: _Component,
) => {
    (component as FC).displayName = displayName;
    return component;
};