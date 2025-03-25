// eslint-disable-next-line import-x/no-extraneous-dependencies
import { moveFocusInside as moveFocusInsideLib, focusInside } from 'focus-lock';



export const moveFocusInside = (
    targetElement: HTMLElement | null,
    focusOptions?: FocusOptions,
): boolean => {
    if (!targetElement) return false;
    if (focusInside(targetElement)) return false;

    moveFocusInsideLib(
        targetElement,
        // @ts-expect-error null should(???) be valid arg https://github.com/theKashey/focus-lock/blob/master/src/focusSolver.ts#L30
        document.activeElement,
        { focusOptions: focusOptions },
    );

    return true;
};