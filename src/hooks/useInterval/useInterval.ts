import { useEffect, useRef } from 'react';
import { useFunction } from '@hooks/useFunction';


/**
 * Sets up an interval that repeatedly calls the
 * provided callback function.
 *
 * The interval is cleared whenever the delay changes
 * or when the component unmounts.
 */
export const useInterval = (
    callback: () => void,
    delay: number,
) => {
    const idRef = useRef<ReturnType<typeof setInterval>>();
    const _callback = useFunction(callback);

    useEffect(() => {
        clearInterval(idRef.current);

        idRef.current = setInterval(_callback, delay);

        return () => {
            clearInterval(idRef.current);
        };
    }, [_callback, delay]);
};