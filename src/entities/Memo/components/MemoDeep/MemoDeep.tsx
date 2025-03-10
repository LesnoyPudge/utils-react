import { deepEqual } from '@lesnoypudge/utils';
import { withDisplayName } from '@utils/withDisplayName';
import { memo, PropsWithChildren } from 'react';



export namespace MemoDeep {
    export type Props = PropsWithChildren;
}

/**
 * Deeply memoized component.
 */
export const MemoDeep = withDisplayName(
    'MemoDeep',
    memo<MemoDeep.Props>(({ children }) => children, deepEqual),
);