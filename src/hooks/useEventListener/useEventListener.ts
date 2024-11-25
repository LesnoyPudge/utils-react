import { addEventListener } from '@lesnoypudge/utils-web';
import { useFunction, useMemoShallow } from '@hooks';
import { useLayoutEffect } from 'react';
import { useRefManager } from '@entities';



type EventMap<_Element extends addEventListener.ElementUnion> = {
    [K in keyof addEventListener.AvailableEventNames<_Element>]: (
        addEventListener.AvailableEventNames<_Element>[K]
    );
};

type EventNames<_Element extends addEventListener.ElementUnion> = (
    keyof addEventListener.AvailableEventNames<_Element>
);

export namespace useEventListener {
    export type ProvidedElement<
        _ProvidedType extends addEventListener.ElementUnion,
    > = (
        _ProvidedType extends HTMLElement
            ? useRefManager.RefManager<_ProvidedType>
            : _ProvidedType
    );
}

export const useEventListener = <
    _ProvidedType extends addEventListener.ElementUnion,
    _EventName extends EventNames<_ProvidedType>,
>(
    element: useEventListener.ProvidedElement<_ProvidedType>,
    eventName: _EventName,
    callback: (e: EventMap<_ProvidedType>[_EventName]) => void,
    options?: AddEventListenerOptions,
) => {
    const _callback = useFunction(callback);
    const _options = useMemoShallow(options);

    useLayoutEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_options]);
};