import { withDisplayName } from '@utils/withDisplayName';
import { memo, PropsWithChildren } from 'react';



const staticCompare = () => true;

/**
 * Prevents children from re-rendering.
 */
export const Static = withDisplayName('Static', memo<PropsWithChildren>(({
    children,
}) => {
    return children;
}, staticCompare));