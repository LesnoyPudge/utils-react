import { useRefManager } from '@hooks/useRefManager';
import { useIsFocused } from './useIsFocused';
import { renderHook } from '@testing-library/react';
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
        wrapperLoc,
        buttonLoc,
        resetFocus: async () => {
            await userEvent.click(document.body);
        },
    };
};

const createHook = (element: Element) => {
    return renderHook(() => useIsFocused(useRefManager(element)));
};

describe('useIsFocused', () => {
    it('focus base', () => {
        const { wrapperLoc, resetFocus } = createElements();
        const {} = createHook(wrapperLoc.element());
    });

    it('focus within', () => {});

    it('focus visible', () => {});

    it('focus visible within', () => {});
});