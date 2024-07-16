import { useConst } from '@hooks';
import { useEffect, useRef } from 'react';



export const useIsMounted = () => {
    const isMountedRef = useRef(false);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const getIsMounted = useConst(() => () => {
        return isMountedRef.current;
    });

    return { getIsMounted };
};