import { useLatest } from '@hooks/useLatest';
import { useEffect } from 'react';



/**
 * Executes the provided function when the component is unmounted.
 */
export const useUnmountEffect = (fn: () => void) => {
    const fnRef = useLatest(fn);

    useEffect(() => {
        const fn = fnRef.current;

        return () => {
            fn();
        };
    }, [fnRef]);
};