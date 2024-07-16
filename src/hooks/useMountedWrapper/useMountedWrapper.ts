import { useIsMounted } from '@hooks';
import { useCallback } from 'react';



export const useMountedWrapper = () => {
    const { getIsMounted } = useIsMounted();

    const mounted = useCallback((callback: () => void) => {
        if (!getIsMounted()) return;

        callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        mounted,
    };
};