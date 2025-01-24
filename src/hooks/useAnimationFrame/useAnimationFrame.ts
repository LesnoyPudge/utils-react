import { useRef, useLayoutEffect } from 'react';
import { useFunction } from '@hooks/useFunction';



export namespace useAnimationFrame {
    export type Return = {
        start: VoidFunction;
        stop: VoidFunction;
    };
}

/**
 * Starts and stops an animation frame loop with a provided callback.
 * The callback is invoked on each animation frame while enabled.
 */
export const useAnimationFrame = (
    callback: FrameRequestCallback,
    enabled: boolean,
): useAnimationFrame.Return => {
    const frameIdRef = useRef(0);
    const isRunningRef = useRef(false);

    const stop = useFunction(() => {
        isRunningRef.current = false;

        cancelAnimationFrame(frameIdRef.current);
    });

    const start = useFunction(() => {
        isRunningRef.current = true;

        frameIdRef.current = requestAnimationFrame((time) => {
            if (!isRunningRef.current) return;

            callback(time);
            start();
        });
    });

    useLayoutEffect(() => {
        if (!enabled) return;

        start();

        return stop;
    }, [enabled, start, stop]);

    return {
        start,
        stop,
    };
};