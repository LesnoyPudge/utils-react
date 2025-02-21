import { useRefManager } from '@hooks/useRefManager';
import { useLayoutEffect } from 'react';



/**
 * Synchronizes animations for the referenced element by setting
 * their start time to 0.
 */
export const useSynchronizedAnimation = (
    elementRef: useRefManager.NullableRefManager<HTMLElement>,
) => {
    useLayoutEffect(() => {
        return elementRef.effect((node) => {
            if (!node) return;

            node.getAnimations().forEach((animation) => {
                animation.startTime = 0;
            });
        });
    }, [elementRef]);
};