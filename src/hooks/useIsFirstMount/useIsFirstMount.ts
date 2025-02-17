import { useEffect, useRef } from 'react';



/**
 * Tracks whether the component on its first mount.
 *
 * If a render is canceled, the value is not updated.
 */
export const useIsFirstMount = () => {
    const isFirstMountRef = useRef(true);

    useEffect(() => {
        if (!isFirstMountRef.current) return;

        isFirstMountRef.current = false;
    }, []);

    return {
        // eslint-disable-next-line react-compiler/react-compiler
        isFirstMount: isFirstMountRef.current,
    };
};