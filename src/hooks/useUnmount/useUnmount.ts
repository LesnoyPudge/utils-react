import { useLatest } from '@hooks';
import { useEffect } from 'react';



export const useUnmount = (fn: () => void) => {
    const fnRef = useLatest(fn);

    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            fnRef.current();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};