import { deepEqual } from '@lesnoypudge/utils';
import { withDisplayName } from '@utils/withDisplayName';
import { memo, PropsWithChildren } from 'react';



/**
 * Memoize children with deep props comparison.
 */
export const Memo = withDisplayName('Memo', memo<PropsWithChildren>(({
    children,
}) => {
    return children;
}, deepEqual));