import { useEffect, useRef } from 'react';
import { useFunction } from '@hooks';



export const useInterval = (
    callback: () => void,
    delay: number,
) => {
    const idRef = useRef<number | null>(null);
    const _callback = useFunction(callback);

    useEffect(() => {
        if (idRef.current !== null) clearInterval(idRef.current);

        idRef.current = setInterval(_callback, delay);

        return () => {
            if (idRef.current !== null) clearInterval(idRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delay]);
};