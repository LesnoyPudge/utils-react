import { useRefManager } from '@entities/RefManager';
import { useEventListener } from '@hooks/useEventListener';
import { isHtmlElement } from '@lesnoypudge/utils-web';
import { useState } from 'react';



const containsRelatedTarget = (event: FocusEvent) => {
    if (
        isHtmlElement(event.currentTarget)
        && isHtmlElement(event.relatedTarget)
    ) {
        return event.currentTarget.contains(event.relatedTarget);
    }

    return false;
};

export const useIsFocusedWithin = (
    container: useRefManager.RefManager<HTMLElement>,
) => {
    const [isFocusedWithin, setIsFocusedWithin] = useState((
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
            if (!containsRelatedTarget(e)) return;

            setIsFocusedWithin(false);
        },
    );

    return {
        isFocusedWithin,
    };
};