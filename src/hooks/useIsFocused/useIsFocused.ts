import { useRefManager } from '@hooks/useRefManager';
import { useEventListener } from '@hooks/useEventListener';
import { useEffect, useState } from 'react';
import { combinedFunction, noop } from '@lesnoypudge/utils';
import { FocusVisibleManager } from '@lesnoypudge/utils-web';
import { useFunction } from '@hooks/useFunction';
import { useConst } from '@hooks/useConst';
import { mutate } from '@utils/mutate';



export namespace useIsFocused {
    export type Options = {
        /**
         * Tracks if element has focused children.
         * @default false
         */
        within?: boolean;
        /**
         * Tracks if focus is visible to user.
         * @default false
         */
        visible?: boolean;
        /**
         * Disable state updates. Ref will keep updating.
         * @default false
         */
        stateless?: boolean;
        /**
         * Triggered when element receive focus.
         */
        onFocus?: (focusedElement: Element) => void;
        /**
         * Triggered when element lose focus.
         */
        onBlur?: (e: FocusEvent) => void;
    };

    export type Return = {
        isFocused: boolean;
        isFocusedRef: useRefManager.RefManager<boolean>;
    };
}

/**
 * Tracks element's configurable focus state.
 */
export const useIsFocused = (
    elementRef: useRefManager.NullableRefManager<HTMLElement>,
    options?: useIsFocused.Options,
): useIsFocused.Return => {
    const {
        within = false,
        stateless = false,
        visible = false,
        onBlur = noop,
        onFocus = noop,
    } = options ?? {};

    const focusManager = useConst(() => new FocusVisibleManager());
    const [isFocused, setIsFocused] = useState(false);
    const isFocusedRef = useRefManager(isFocused);

    const inEvent = within ? 'focusin' : 'focus';
    const outEvent = within ? 'focusout' : 'blur';
    const withStateUpdate = !stateless;

    const eventTypeToFlag = {
        base: !visible && !within,
        visibleWithin: visible && within,
        visible: visible && !within,
        within: !visible && within,
    };

    const getShouldUpdateState = (e: FocusEvent): boolean => {
        const observable = elementRef.current;
        if (!observable) return false;
        if (!e.target) return false;
        if (visible) return false;

        const relatedTarget = e.relatedTarget as Node | null;
        const isDifferent = observable !== relatedTarget;

        if (eventTypeToFlag.base) {
            return isDifferent;
        }

        if (eventTypeToFlag.within) {
            const notContains = !observable.contains(relatedTarget);

            return notContains;
        }

        return false;
    };

    const updateState = (newState: boolean) => {
        if (isFocusedRef.current === newState) return;

        withStateUpdate && setIsFocused(newState);
        mutate(isFocusedRef, 'current', newState);
    };

    const getShouldUpdateVisibleState = (
        direction: 'in' | 'out',
        element: Element | EventTarget | null,
    ): boolean => {
        const observable = elementRef.current;
        if (!observable) return false;

        const isIn = direction === 'in';
        const isSame = observable === element;
        const shouldUpdateState = (
            isIn
                ? !isFocusedRef.current
                : isFocusedRef.current
        );

        const shouldResetFocus = (
            isFocusedRef.current
            && !focusManager.isValidFocusTarget(element)
        );
        if (shouldResetFocus) return true;

        if (eventTypeToFlag.visible) {
            if (isIn) {
                return shouldUpdateState && isSame;
            }

            return shouldUpdateState && !isSame;
        }

        if (eventTypeToFlag.visibleWithin) {
            const isContains = (
                focusManager.isValidFocusTarget(element)
                && observable.contains(element)
            );

            if (isIn) {
                return shouldUpdateState && isContains;
            }

            return shouldUpdateState && !isContains;
        }

        return false;
    };

    const handleVisibleEvents = useFunction(() => {
        return combinedFunction(
            focusManager.onIn((element) => {
                if (!getShouldUpdateVisibleState(
                    'in',
                    element,
                )) return;

                updateState(true);

                onFocus(element);
            }),

            focusManager.onOut((e) => {
                if (!getShouldUpdateVisibleState(
                    'out',
                    e.relatedTarget,
                )) return;

                updateState(false);

                onBlur(e);
            }),
        );
    });

    useEffect(() => {
        focusManager.start();

        return combinedFunction(
            handleVisibleEvents(),
            focusManager.clean,
        );
    }, [handleVisibleEvents, focusManager]);

    useEventListener(
        elementRef,
        inEvent,
        (e) => {
            if (!focusManager.isValidFocusTarget(e.target)) return;
            if (!getShouldUpdateState(e)) return;

            updateState(true);

            onFocus(e.target);
        },
    );

    useEventListener(
        elementRef,
        outEvent,
        (e) => {
            if (!getShouldUpdateState(e)) return;

            updateState(false);

            onBlur(e);
        },
    );

    return {
        isFocused,
        isFocusedRef,
    };
};