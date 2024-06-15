import { useCallback, useState } from 'react';



export const useForceUpdate = () => {
    const [, setState] = useState<object>({});
    const forceUpdate = useCallback(() => setState({}), []);

    return {
        forceUpdate,
    };
};