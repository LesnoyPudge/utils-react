import { useFunction } from '@hooks';
import { useEffect, useRef } from 'react';



export const useIsMounted = () => {
    const isMountedRef = useRef(false);

    useEffect(() => {
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