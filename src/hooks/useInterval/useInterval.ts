import { useEffect, useRef } from 'react';
import { useFunction } from '@hooks/useFunction';



export const useInterval = (
    callback: () => void,
    delay: number,
) => {
    const idRef = useRef<ReturnType<typeof setInterval>>();
    const _callback = useFunction(callback);

    useEffect(() => {
        clearInterval(idRef.current);

        idRef.current = setInterval(_callback, delay);

        return () => {
            clearInterval(idRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delay]);
};