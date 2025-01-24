import { useFunction } from '@hooks/useFunction';
import { useIsMounted } from '@hooks/useIsMounted';



/**
 * Returns a function that executes the provided callback only
 * if the component is mounted.
 */
export const useMountedWrapper = () => {
    const { getIsMounted } = useIsMounted();

    const mounted = useFunction((callback: () => void) => {
        if (!getIsMounted()) return;

        callback();
    });

    return {
        mounted,
    };
};