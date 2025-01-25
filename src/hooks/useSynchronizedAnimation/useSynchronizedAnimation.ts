import { useRefManager } from '@entities/RefManager';
import { useLayoutEffect } from 'react';



/**
 * Synchronizes animations for the referenced element by setting
 * their start time to 0.
 */
export const useSynchronizedAnimation = (
    elementRef: useRefManager.RefManager<HTMLElement>,
) => {
    useLayoutEffect(() => {
        return elementRef.effect((node) => {
            node.getAnimations().forEach((animation) => {
                animation.startTime = 0;
            });
        });
    }, [elementRef]);
};