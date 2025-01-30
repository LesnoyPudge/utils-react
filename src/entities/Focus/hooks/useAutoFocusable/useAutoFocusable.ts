import { useRefManager } from '@hooks/useRefManager';
import { useLayoutEffect } from 'react';



const FOCUS_AUTO = 'data-autofocus-inside';

/**
 * Marks provided ref as autoFocusable.
 * Returns autoFocusable props for manual usage.
 */
export const useAutoFocusable = (
    isEnabled: boolean,
    elementRef?: useRefManager.RefManager<HTMLElement>,
) => {
    useLayoutEffect(() => {
        return elementRef?.effect((node) => {
            node.setAttribute(FOCUS_AUTO, String(isEnabled));
        });
    }, [elementRef, isEnabled]);

    return {
        [FOCUS_AUTO]: isEnabled,
    };
};