import { useFunction } from '@hooks/useFunction';
import { isHtmlElement } from '@lesnoypudge/utils-web';
import { useId, useLayoutEffect, useRef } from 'react';
import { useRefManager } from '@entities/RefManager';
import { useFocusContext } from '../../../../hooks';
import { FocusContext } from '../../../../context';
import { combinedFunction } from '@lesnoypudge/utils';



export namespace useMoveFocusInside {
    export type Options = {
        /**
         * @default false;
         */
        enabled?: boolean;
        /**
         * If set to true, will change focus even if
         * another element is already focused and visible
         *
         * @default false;
         */
        forced?: boolean;
        /**
         * If set to true, focus will be applied only once.
         *
         * @default false;
         */
        once?: boolean;
    };

    export type Args = [
        containerRef: useRefManager.RefManager<HTMLElement>,
        options?: Options,
    ];

    export type Return = (
        FocusContext
        & {
            moveFocusInside: VoidFunction;
        }
    );
}

const FOCUSABLE_SELECTOR = [
    'a:not([tabindex="-1"])',
    'button:not([tabindex="-1"]):not([disabled])',
    'input:not([tabindex="-1"]):not([disabled])',
    'textarea:not([tabindex="-1"]):not([disabled])',
    'select:not([tabindex="-1"]):not([disabled])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
].join(', ');

const isVisible = (
    container: Element,
    element: Element,
): element is HTMLElement => {
    let _element: Element | null = element;

    while (_element) {
        if (window.getComputedStyle(_element).display === 'none') return false;

        if (_element === container) break;

        _element = _element.parentElement;
    }

    if (_element && !isHtmlElement(_element)) return false;

    return true;
};

const getFocusableElement = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(FOCUSABLE_SELECTOR);
    if (!focusableElements) return;

    return [...focusableElements].find((element) => {
        return isVisible(container, element);
    });
};

const focusOptions: FocusOptions = {
    preventScroll: false,
    // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#focusvisible
    focusVisible: true,
};

export const useMoveFocusInside = (...[
    containerRef,
    options,
]: useMoveFocusInside.Args): useMoveFocusInside.Return => {
    const id = useId();
    const { focusMap, focusQueue } = useFocusContext();
    const isAppliedAtLeastOnceRef = useRef(false);

    const removeId = useFunction(() => {
        focusQueue.current = focusQueue.current.filter((_id) => {
            return _id !== id;
        });
    });

    const addId = useFunction(() => {
        focusQueue.current.push(id);

        return removeId;
    });

    const moveFocusInside = useFunction(() => {
        const container = containerRef.current;
        if (!container) return false;

        const focusableElement = getFocusableElement(container);
        if (!focusableElement) return false;

        focusableElement.focus(focusOptions);

        return true;
    });

    useLayoutEffect(() => {
        const {
            enabled = false,
            forced = false,
            once = false,
        } = options ?? {};

        if (!enabled) return;
        if (once && isAppliedAtLeastOnceRef.current) return;

        return containerRef.effect((node) => {
            const shouldGentleBail = (
                !forced
                && document.activeElement
                && isVisible(document.body, document.activeElement)
            );
            if (shouldGentleBail) return;
            if (focusQueue.current.length) return;

            const isFocusApplied = moveFocusInside();
            isAppliedAtLeastOnceRef.current = isFocusApplied;

            if (isFocusApplied) return addId();

            const observer = new MutationObserver((_, observer) => {
                const isFocusApplied = moveFocusInside();
                isAppliedAtLeastOnceRef.current = isFocusApplied;

                if (!isFocusApplied) return;

                addId();
                observer.disconnect();
            });

            observer.observe(node, {
                attributes: true,
                childList: true,
                subtree: true,
            });

            return () => {
                observer.disconnect();
                removeId();
            };
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [!!options?.enabled]);

    return {
        moveFocusInside,
        focusMap,
        focusQueue,
    };
};