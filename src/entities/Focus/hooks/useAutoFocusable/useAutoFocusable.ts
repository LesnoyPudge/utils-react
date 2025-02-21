import { useRefManager } from '@hooks/useRefManager';
import { useLayoutEffect } from 'react';



const FOCUS_AUTO = 'data-autofocus-inside';

/**
 * Marks provided ref as autoFocusable.
 * Returns autoFocusable props for manual usage.
 */
export const useAutoFocusable = (
    isEnabled: boolean,
    elementRef?: useRefManager.NullableRefManager<HTMLElement>,
) => {
    useLayoutEffect(() => {
        return elementRef?.effect((node) => {
            if (!node) return;

            node.setAttribute(FOCUS_AUTO, String(isEnabled));
        });
    }, [elementRef, isEnabled]);

    return {
        [FOCUS_AUTO]: isEnabled,
    };
};