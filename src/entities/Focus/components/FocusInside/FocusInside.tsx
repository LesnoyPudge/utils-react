import { useRefManager } from '@entities/RefManager';
import { useAutoFocusable } from '../../hooks';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { PropsWithChildren, useEffect, useRef } from 'react';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { moveFocusInside, focusInside } from 'focus-lock';



export namespace FocusInside {
    export type Options = {
        isEnabled: boolean;

        /**
         * Once per activation;
         * @default false
         */
        once?: boolean;
    };

    type WithContainerRef = {
        containerRef: useRefManager.RefManager<HTMLElement>;
    };

    export type Props = T.Simplify<(
        PropsWithChildren
        & WithContainerRef
        & Options
    )>;
}

export const FocusInside = ({
    containerRef,
    isEnabled,
    once = false,
    children,
}: FocusInside.Props) => {
    const focusedOnceRef = useRef(false);

    useAutoFocusable(isEnabled, containerRef);

    // https://github.com/theKashey/react-focus-lock/blob/master/src/MoveFocusInside.js#L7
    useEffect(() => {
        if (!isEnabled) {
            focusedOnceRef.current = false;
            return;
        }
        if (focusedOnceRef.current) return;

        return containerRef.effect((node) => {
            if (focusInside(node)) return;

            moveFocusInside(
                node,
                // @ts-expect-error null should be valid arg https://github.com/theKashey/focus-lock/blob/master/src/focusSolver.ts#L30
                document.activeElement,
            );

            focusedOnceRef.current = once;
        });
    }, [once, isEnabled, containerRef]);

    return children;
};