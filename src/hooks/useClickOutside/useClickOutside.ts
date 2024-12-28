import { useRefManager } from '@entities/RefManager';
import { useEventListener } from '@hooks/useEventListener';



export const useClickOutside = (
    elementRef: useRefManager.RefManager<HTMLElement>,
    handler: (e: MouseEvent) => void,
) => {
    useEventListener(document, 'mousedown', (e: MouseEvent) => {
        const target = e.target as Node | null;

        if (!target?.isConnected) return;
        if (!elementRef.current) return;
        if (elementRef.current.contains(target)) return;

        handler(e);
    });
};