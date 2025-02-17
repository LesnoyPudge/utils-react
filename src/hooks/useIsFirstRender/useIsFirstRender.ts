import { useRef } from 'react';



/**
 * Tracks whether the component on its first render.
 *
 * Value is changed even if render is canceled.
 */
export const useIsFirstRender = () => {
    const isFirstRenderRef = useRef(true);

    // eslint-disable-next-line react-compiler/react-compiler
    if (isFirstRenderRef.current) {
        // eslint-disable-next-line react-compiler/react-compiler
        isFirstRenderRef.current = false;

        return {
            isFirstRender: true,
        };
    }

    return {
        isFirstRender: false,
    };
};