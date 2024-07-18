import { useLatest } from '@hooks';
import { useEffect } from 'react';



export const useMountEffect = (fn: () => void) => {
    const fnRef = useLatest(fn);

    useEffect(() => {
        fnRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};