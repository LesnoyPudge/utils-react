import { addEventListener } from '@lesnoypudge/utils-web';
import { useFunction } from '@hooks/useFunction';
import { useMemoShallow } from '@hooks/useMemoShallow';
import { useEffect } from 'react';
import { useRefManager } from '@hooks/useRefManager';



export namespace useEventListener {
    export type ElementUnion = addEventListener.ElementUnion;

    export type EventMap<_Element extends ElementUnion> = {
        [K in keyof addEventListener.AvailableEventNames<_Element>]: (
            addEventListener.AvailableEventNames<_Element>[K]
        );
    };

    export type EventNames<_Element extends ElementUnion> = (
        keyof addEventListener.AvailableEventNames<_Element>
    );

    export type ProvidedElement<
        _ProvidedType extends ElementUnion,
    > = (
        _ProvidedType extends HTMLElement
            ? useRefManager.RefManager<_ProvidedType>
            : _ProvidedType
    );
}

/**
 * Attaches an event listener to the provided element and cleans it up
 * when the component unmounts or options change.
 */
export const useEventListener = <
    _ProvidedType extends useEventListener.ElementUnion,
    _EventName extends useEventListener.EventNames<_ProvidedType>,
>(
    element: useEventListener.ProvidedElement<_ProvidedType>,
    eventName: _EventName,
    callback: (e: useEventListener.EventMap<_ProvidedType>[_EventName]) => void,
    options?: AddEventListenerOptions,
) => {
    const _callback = useFunction(callback);
    const _options = useMemoShallow(options);

    useEffect(() => {
        if ('effect' in element) {
            return element.effect((node) => {
                return addEventListener(
                    node as _ProvidedType,
                    eventName,
                    _callback,
                    _options,
                );
            });
        }

        return addEventListener(
            element as _ProvidedType,
            eventName,
            _callback,
            _options,
        );
    }, [_callback, _options, element, eventName]);
};