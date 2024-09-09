import { useRefManager } from '@entities';
import { useLayoutEffect } from 'react';



export const useSynchronizedAnimation = (
    elementRef: useRefManager.RefManager<HTMLElement>,
) => {
    useLayoutEffect(() => {
        return elementRef.effect((node) => {
            node.getAnimations().forEach((animation) => {
                animation.startTime = 0;
            });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};