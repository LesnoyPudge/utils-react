import { useFunction, useIsMounted } from '@hooks';



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