import { useRefManager } from '@hooks/useRefManager';
import { useBoolean } from '@hooks/useBoolean';
import { useEventListener } from '@hooks/useEventListener';
import { isHtmlElement } from '@lesnoypudge/utils-web';



const containsRelatedTarget = (event: FocusEvent) => {
    if (
        isHtmlElement(event.currentTarget)
        && isHtmlElement(event.relatedTarget)
    ) {
        return event.currentTarget.contains(event.relatedTarget);
    }

    return false;
};

/**
 * Tracks if the container element is focused within.
 */
export const useIsFocusedWithin = (
    container: useRefManager.NullableRefManager<HTMLElement>,
) => {
    const initialValue = (
        !!container.current?.contains(document.activeElement)
        || (document.activeElement === container.current)
    );
    const focusState = useBoolean(initialValue);

    useEventListener(
        container,
        'focusin',
        focusState.setTrue,
    );

    useEventListener(
        container,
        'focusout',
        (e) => {
            if (!container.current) return;
            if (containsRelatedTarget(e)) return;

            focusState.setFalse();
        },
    );

    return {
        isFocusedWithin: focusState.value,
    };
};