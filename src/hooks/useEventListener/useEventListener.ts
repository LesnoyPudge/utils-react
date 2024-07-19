import { useEffect } from 'react';
import { addEventListener } from '@lesnoypudge/utils';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useFunction, useLatest, useRefCallback } from '@hooks';



type EventMap<Element extends addEventListener.ElementUnion> = {
    [K in keyof addEventListener.AvailableEventNames<Element>]: (
        addEventListener.AvailableEventNames<Element>[K]
    );
};

type EventNames<_Element extends addEventListener.ElementUnion> = (
    keyof addEventListener.AvailableEventNames<_Element>
);

type Return<
    _Element extends addEventListener.ElementUnion,
    _ProvidedElement extends Window | Document | undefined,
> = (
    T.IsEqual<
        _ProvidedElement,
        undefined
    > extends true
        ? ReturnType<typeof useRefCallback<_Element>>
        : undefined
);

export const useEventListener = <
    _Element extends addEventListener.ElementUnion = HTMLElement,
    _ProvidedElement extends Window | Document | undefined = undefined,
    _EventName extends EventNames<(
        T.IsEqual<_ProvidedElement, undefined> extends true
            ? _Element
            : NonNullable<_ProvidedElement>
    )> = EventNames<(
        T.IsEqual<_ProvidedElement, undefined> extends true
            ? _Element
            : NonNullable<_ProvidedElement>
    )>,
>(
    eventName: _EventName,
    callback: (e: EventMap<(
        T.IsEqual<_ProvidedElement, undefined> extends true
            ? _Element
            : NonNullable<_ProvidedElement>
    )>[_EventName]) => void,
    options?: AddEventListenerOptions,
    element?: _ProvidedElement,
): Return<_Element, _ProvidedElement> => {
    const optionsRef = useLatest(options);
    const _callback = useFunction(callback);

    const refCallback = useRefCallback<_Element>((node) => {
        return addEventListener(
            node,
            // @ts-expect-error
            eventName,
            _callback,
            optionsRef.current,
        );
    });

    useEffect(() => {
        if (!element) return;

        return addEventListener(
            element,
            // @ts-expect-error
            eventName,
            _callback,
            optionsRef.current,
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [element]);

    return (
        element ? undefined : refCallback
    ) as Return<_Element, _ProvidedElement>;
};