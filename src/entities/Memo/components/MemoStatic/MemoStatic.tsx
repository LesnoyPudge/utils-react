import { withDisplayName } from '@utils/withDisplayName';
import { memo, PropsWithChildren } from 'react';



const staticCompare = () => true;

export namespace MemoStatic {
    export type Props = PropsWithChildren;
}

/**
 * Prevents re-rendering from props change.
 */
export const MemoStatic = withDisplayName(
    'MemoStatic',
    memo<MemoStatic.Props>(({ children }) => children, staticCompare),
);