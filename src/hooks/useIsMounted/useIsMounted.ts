import { useFunction } from '@hooks/useFunction';
import { useInsertionEffect, useRef } from 'react';



/**
 * Returns a function to check if the component is mounted.
 */
export const useIsMounted = () => {
    const isMountedRef = useRef(false);

    useInsertionEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const getIsMounted = useFunction(() => {
        return isMountedRef.current;
    });

    return { getIsMounted };
};