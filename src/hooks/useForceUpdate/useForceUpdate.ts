import { useState } from 'react';
import { useFunction } from '@hooks/useFunction';



/**
 * Returns a function that triggers a re-render by updating state.
 */
export const useForceUpdate = () => {
    const [forcedState, setState] = useState(0);

    const forceUpdate = useFunction(() => {
        setState((prev) => prev + 1);
    });

    return {
        forceUpdate,
        forcedState,
    };
};