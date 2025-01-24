import { useRef } from 'react';



/**
 * Tracks if the component is mounted for the first time.
 */
export const useIsFirstMount = () => {
    const isFirst = useRef(true);

    if (isFirst.current) {
        isFirst.current = false;

        return {
            isFirstMount: true,
        };
    }

    return {
        isFirstMount: isFirst.current,
    };
};