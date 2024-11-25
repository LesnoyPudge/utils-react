import { useFunction } from '@hooks/useFunction';
import { useIsMounted } from '@hooks/useIsMounted';



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