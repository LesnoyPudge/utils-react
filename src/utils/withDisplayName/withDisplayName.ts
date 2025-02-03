import { FC, ReactNode } from 'react';



/**
 * Adds a display name to a component.
 */
export const withDisplayName = <
    _Component extends (...args: never[]) => ReactNode,
>(
    displayName: string,
    component: _Component,
): _Component & { displayName: string } => {
    (component as unknown as FC).displayName = displayName;

    return component as _Component & { displayName: string };
};