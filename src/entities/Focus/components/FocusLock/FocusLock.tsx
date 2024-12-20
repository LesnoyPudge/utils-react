import { T } from '@lesnoypudge/types-utils-base/namespace';
import { ComponentProps, FC, PropsWithChildren } from 'react';
import FocusLockLib from 'react-focus-lock';



export namespace FocusLock {
    export type Props = (
        PropsWithChildren
        & T.Except<
            ComponentProps<typeof FocusLockLib>,
            'children' | 'ref'
        >
        & {
            innerRef?: ComponentProps<typeof FocusLockLib>['ref'];
        }
    );
}

export const FocusLock: FC<FocusLock.Props> = ({
    children,
    innerRef,
    ...lockProps
}) => {
    return (
        <FocusLockLib

            ref={innerRef}
            {...lockProps}
        >
            {children}
        </FocusLockLib>
    );
};