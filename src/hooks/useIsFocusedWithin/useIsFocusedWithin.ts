import { useRefManager } from '@entities/RefManager';
import { useEventListener } from '@hooks/useEventListener';
import { useUniqueState } from '@hooks/useUniqueState';
import { isHtmlElement } from '@lesnoypudge/utils-web';



export const useIsFocusedWithin = (
    container: useRefManager.RefManager<HTMLElement>,
) => {
    const [isFocusedWithin, setIsFocusedWithin] = useUniqueState((
        !!container.current?.contains(document.activeElement)
        || (document.activeElement === container.current)
    ));

    useEventListener(
        container,
        'focusin',
        () => setIsFocusedWithin(true),
    );

    useEventListener(
        container,
        'focusout',
        (e) => {
            if (!container.current) return;
            if (!isHtmlElement(e.relatedTarget)) {
                return setIsFocusedWithin(false);
            }

            const isWithin = (
                container.current === e.relatedTarget
                || container.current.contains(e.relatedTarget)
            );

            setIsFocusedWithin(isWithin);
        },
    );

    return {
        isFocusedWithin,
    };
};