import { useEffect, useRef } from 'react';
import { useFunction } from '@hooks';



export const useTimeout = (
    callback: () => void,
    delay: number,
) => {
    const idRef = useRef<number | null>(null);
    const _callback = useFunction(callback);

    useEffect(() => {
        if (idRef.current !== null) clearTimeout(idRef.current);

        idRef.current = setTimeout(_callback, delay);

        return () => {
            if (idRef.current !== null) clearTimeout(idRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delay]);
};