import { useRef } from 'react';
import { useFunction } from '@hooks/useFunction';
import { useUnmountEffect } from '@hooks/useUnmountEffect';



export const useIsFirstRender = () => {
    const isFirstRenderRef = useRef(true);

    const getIsFirstRender = useFunction(() => {
        return isFirstRenderRef.current;
    });

    useUnmountEffect(() => {
        isFirstRenderRef.current = false;
    });

    return {
        getIsFirstRender,
    };
};