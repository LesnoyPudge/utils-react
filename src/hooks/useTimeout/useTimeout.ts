import { useEffect, useRef } from 'react';
import { useFunction } from '@hooks/useFunction';



/**
 * Executes a callback after a specified delay and cleans up on unmount or delay change.
 */
export const useTimeout = (
    callback: () => void,
    delay: number,
) => {
    const idRef = useRef<ReturnType<typeof setTimeout>>();
    const _callback = useFunction(callback);

    useEffect(() => {
        clearTimeout(idRef.current);

        idRef.current = setTimeout(_callback, delay);

        return () => {
            clearTimeout(idRef.current);
        };
    }, [_callback, delay]);
};