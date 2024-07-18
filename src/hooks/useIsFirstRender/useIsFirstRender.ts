import { useRef } from 'react';
import { useFunction, useUnmountEffect } from '@hooks';



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