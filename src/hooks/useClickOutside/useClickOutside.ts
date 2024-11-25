import { useRefManager } from '@entities/RefManager';
import { useEventListener } from '@hooks/useEventListener';
import { useFunction } from '@hooks/useFunction';



export const useClickOutside = (
    elementRef: useRefManager.RefManager<HTMLElement>,
    handler: (e: MouseEvent) => void,
) => {
    const callback = useFunction((e: MouseEvent) => {
        const target = e.target as Node | null;

        if (!target?.isConnected) return;
        if (!elementRef.current) return;
        if (elementRef.current.contains(target)) return;

        handler(e);
    });

    useEventListener(elementRef, 'mousedown', callback);
};