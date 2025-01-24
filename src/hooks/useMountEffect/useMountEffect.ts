import { useLatest } from '@hooks/useLatest';
import { useEffect } from 'react';



/**
 * Executes the provided function only on component mount.
 */
export const useMountEffect = (fn: () => void) => {
    const fnRef = useLatest(fn);

    useEffect(() => {
        fnRef.current();
    }, [fnRef]);
};