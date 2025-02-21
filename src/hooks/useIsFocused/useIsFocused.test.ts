import { useRefManager } from '@hooks/useRefManager';
import { useIsFocused } from './useIsFocused';
import { act, renderHook } from '@testing-library/react';
import { page, userEvent } from '@vitest/browser/context';



const createElements = () => {
    const wrapper = document.createElement('div');
    const button = document.createElement('button');

    wrapper.tabIndex = 0;
    wrapper.dataset.testid = 'wrapper';
    wrapper.style.padding = '10px';
    wrapper.style.margin = '10px';
    button.textContent = 'test';
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

const expectBodyToBeFocused = () => {
    expect(document.body).toBe(document.activeElement);
};

const expectToBeFocused = (element: HTMLElement) => {
    expect(element).toBe(document.activeElement);
};

const tab = async () => {
    await act(async () => await userEvent.tab());
};

const focus = async (element: HTMLElement) => {
    await act(async () => await userEvent.click(element));
};

describe('useIsFocused', () => {
    it('should track focus base', async () => {
        const { wrapper, button, resetFocus, cleanup } = createElements();
        const { expectFocusState } = createHook(
            wrapper, { visible: false, within: false },
        );

        expectBodyToBeFocused();

        expectFocusState(false);

        await focus(wrapper);

        expectFocusState(true);

        await focus(button);

        expectFocusState(false);

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