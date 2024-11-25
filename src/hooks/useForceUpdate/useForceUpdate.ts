import { useState } from 'react';
import { useFunction } from '@hooks/useFunction';



export const useForceUpdate = () => {
    const [_, setState] = useState(0);

    const forceUpdate = useFunction(() => {
        setState((prev) => prev + 1);
    });

    return {
        forceUpdate,
    };
};