import { RefObject, useEffect } from 'react';
import { addEventListener } from '@lesnoypudge/utils';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useLatest } from '@hooks';
import { isRef } from '@utils';



type ArgsWithReplacedElement<
    _Element extends addEventListener.ElementUnion,
    _EventName extends keyof addEventListener.AvailableEventNames<_Element>,
> = T.ArraySplice<
    Parameters<typeof addEventListener<_Element, _EventName>>,
    0,
    1,
    [element: RefObject<_Element> | _Element]
>;

export const useEventListenerV2 = <
    _Element extends addEventListener.ElementUnion,
    _EventName extends keyof addEventListener.AvailableEventNames<_Element>,
>(
    ...args: ArgsWithReplacedElement<_Element, _EventName>
) => {
    const lastArgs = useLatest(args);

    useEffect(() => {
        const [elementOrRef, eventName, _, options] = lastArgs.current;

        const element = (
            isRef(elementOrRef)
                ? elementOrRef.current
                : elementOrRef
        );
        if (!element) return;

        return addEventListener(
            element,
            eventName,
            (e) => lastArgs.current[2](e),
            options,
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};