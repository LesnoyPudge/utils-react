import { FC } from 'react';



export const withDisplayName = <_Component extends FC>(
    displayName: string,
    component: _Component,
) => {
    component.displayName = displayName;
    return component;
};