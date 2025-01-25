import { useFunction } from '@hooks/useFunction';
import { useRef } from 'react';



/**
 * Tracks if the component is mounted for the first time.
 */
export const useIsFirstMount = () => {
    const countRef = useRef(0);

    countRef.current += 1;

    const getIsFirstMount = useFunction(() => {
        return countRef.current === 1;
    });

    return {
        getIsFirstMount,
    };
};