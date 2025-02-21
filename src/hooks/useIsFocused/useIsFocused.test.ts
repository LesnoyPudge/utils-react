import { useRefManager } from '@hooks/useRefManager';
import { useIsFocused } from './useIsFocused';
import { act, renderHook } from '@testing-library/react';
import { page, userEvent } from '@vitest/browser/context';



const expectToBeFocused = (element: HTMLElement) => {
    expect(element).toBe(document.activeElement);
};

const expectBodyToBeFocused = () => {
    expectToBeFocused(document.body);
};

const createElements = () => {
    const wrapper = document.createElement('div');
    // webkit cant focus on actual button :)
    const button = document.createElement('div');

    wrapper.tabIndex = 0;
    wrapper.dataset.testid = 'wrapper';
    wrapper.style.margin = '10px';
    wrapper.textContent = 'space for click';

    button.tabIndex = 0;
    button.textContent = 'test';
    button.style.margin = '10px';
    button.dataset.testid = 'button';

    wrapper.append(button);
    document.body.append(wrapper);

    const wrapperLoc = page.elementLocator(wrapper);
    const buttonLoc = page.elementLocator(button);

    return {
        wrapper,
        button,
        wrapperLoc,
        buttonLoc,
        resetFocus: async () => {
            await act(async () => await userEvent.click(document.body));
            expectBodyToBeFocused();
        },
        cleanup: () => {
            wrapper.remove();
        },
    };
};

const createHook = (
    element: HTMLElement,
    options: Pick<Required<useIsFocused.Options>, 'visible' | 'within'>,
) => {
    const hook = renderHook(({ _options }) => useIsFocused(
        useRefManager(element),
        _options,
    ), { initialProps: { _options: options } });

    return {
        hook,
        getState: () => {
            return hook.result.current.isFocused;
        },
        expectFocusState: (value: boolean) => {
            expect(hook.result.current.isFocused).toBe(value);
        },
    };
};

const tab = async () => {
    await act(async () => await userEvent.tab());
};

const focus = async (element: HTMLElement) => {
    await act(async () => await userEvent.click(element));
    expectToBeFocused(element);
};

describe('useIsFocused', () => {
    it('should track focus base', async () => {
        const { wrapper, button, resetFocus, cleanup } = createElements();
        const { expectFocusState } = createHook(
            wrapper, { visible: false, within: false },
        );

        expectBodyToBeFocused();

        await focus(button);

        expectFocusState(false);

        await focus(wrapper);

        expectFocusState(true);

        await resetFocus();

        expectFocusState(false);

        cleanup();
    });

    it('should track focus within', async () => {
        const { wrapper, button, resetFocus, cleanup } = createElements();
        const { expectFocusState } = createHook(
            wrapper, { visible: false, within: true },
        );

        expectBodyToBeFocused();

        expectFocusState(false);

        await focus(wrapper);

        expectFocusState(true);

        await focus(button);

        expectFocusState(true);

        await resetFocus();

        expectFocusState(false);

        cleanup();
    });

    it('should track focus visible', async () => {
        const { wrapper, resetFocus, cleanup } = createElements();
        const { expectFocusState } = createHook(
            wrapper, { visible: true, within: false },
        );

        expectBodyToBeFocused();

        expectFocusState(false);

        await focus(wrapper);

        expectFocusState(false);

        await resetFocus();

        await tab();

        expectFocusState(true);

        await tab();

        expectFocusState(false);

        cleanup();
    });

    it('should track focus visible within', async () => {
        const { wrapper, button, resetFocus, cleanup } = createElements();
        const { expectFocusState } = createHook(
            wrapper, { visible: true, within: true },
        );

        expectBodyToBeFocused();

        expectFocusState(false);

        await focus(wrapper);

        expectFocusState(false);

        await resetFocus();

        await tab();

        expectFocusState(true);
        expectToBeFocused(wrapper);

        await tab();

        expectFocusState(true);
        expectToBeFocused(button);

        await resetFocus();

        expectFocusState(false);

        cleanup();
    });
});