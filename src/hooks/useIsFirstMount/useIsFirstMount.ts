import { useRef } from 'react';



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