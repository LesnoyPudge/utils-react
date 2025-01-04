import { useFunction } from '@hooks/useFunction';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { isCallable } from '@lesnoypudge/utils';
import { ComponentProps, FC, PropsWithChildren, useRef } from 'react';
import { FocusOn } from 'react-focus-on';



export namespace FocusLock {
    export type ReturnFocusFn = (returnTo: Element) => boolean | FocusOptions;

    export type Props = (
        PropsWithChildren
        & T.Except<
            ComponentProps<typeof FocusOn>,
            'children' | 'ref'
        >
        & {
            innerRef?: ComponentProps<typeof FocusOn>['ref'];
        }
    );
}

export const FocusLock: FC<FocusLock.Props> = ({
    children,
    innerRef,
    onActivation,
    returnFocus,
    ...lockProps
}) => {
    const isActivatedRef = useRef(false);

    // prevent returnFocus before activation (StrictMode fix)
    const returnFocusFn: FocusLock.ReturnFocusFn = useFunction((node) => {
        if (!isActivatedRef.current) return false;

        return (
            isCallable(returnFocus)
                ? returnFocus(node)
                : returnFocus ?? false
        );
    });

    const _onActivation = useFunction((node: HTMLElement) => {
        isActivatedRef.current = true;

        return onActivation?.(node);
    });

    return (
        <FocusOn
            returnFocus={returnFocusFn}
            onActivation={_onActivation}
            ref={innerRef}
            {...lockProps}
        >
            {children}
        </FocusOn>
    );
};