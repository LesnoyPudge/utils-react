import { useRef, useLayoutEffect } from 'react';
import { useFunction } from '@hooks';



export const useAnimationFrame = (
    callback: FrameRequestCallback,
    enabled: boolean,
) => {
    const frameIdRef = useRef(0);

    const stop = useFunction(() => {
        cancelAnimationFrame(frameIdRef.current);
    });

    const start = useFunction(() => {
        stop();

        frameIdRef.current = requestAnimationFrame((time) => {
            callback(time);
            start();
        });
    });

    useLayoutEffect(() => {
        if (!enabled) return;

        start();

        return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    return {
        start,
        stop,
    };
};