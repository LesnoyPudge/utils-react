import { useFunction } from '@hooks/useFunction';
import { useEffect } from 'react';



/**
 * Executes the provided function when the component is unmounted.
 */
export const useUnmountEffect = (fn: () => void) => {
    const callback = useFunction(fn);

    useEffect(() => {
        return () => {
            callback();
        };
    }, [callback]);
};