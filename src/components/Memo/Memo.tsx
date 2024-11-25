import { deepEqual } from '@lesnoypudge/utils';
import { withDisplayName } from '@utils/withDisplayName';
import { memo, PropsWithChildren } from 'react';



/**
 * Children is memoized with deep props comparison.
 */
export const Memo = withDisplayName('Memo', memo<PropsWithChildren>(({
    children,
}) => {
    return children;
}, deepEqual));