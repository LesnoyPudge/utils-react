import { renderHook } from '@testing-library/react';
import { Focus } from '../index';
import { useRefManager } from '@hooks/useRefManager';


describe('Focus', () => {
    it('should be defined', () => {
        expect(Focus.Inside).toBeDefined();
        expect(Focus.Lock).toBeDefined();
        expect(Focus.useAutoFocusable).toBeDefined();
        expect(Focus.useMoveFocusInside).toBeDefined();
    });

    it('should focus with options flag and with controls', async () => {
        const wrapper = document.createElement('div');
        const button1 = document.createElement('button');
        const button2 = document.createElement('button');

        wrapper.append(button1);
        wrapper.append(button2);
        document.body.append(wrapper);

        const hook = renderHook(({
            isEnabled,
        }) => Focus.useMoveFocusInside({
            containerRef: useRefManager(wrapper),
            isEnabled,
        }), {
            initialProps: { isEnabled: false },
        });

        await expect.element(button1).not.toHaveFocus();
        await expect.element(button2).not.toHaveFocus();

        hook.result.current.moveFocusInside();

        await expect.element(button1).toHaveFocus();
        await expect.element(button2).not.toHaveFocus();

        button2.focus();

        await expect.element(button1).not.toHaveFocus();
        await expect.element(button2).toHaveFocus();

        hook.result.current.moveFocusInside();

        await expect.element(button1).not.toHaveFocus();
        await expect.element(button2).toHaveFocus();

        button2.blur();

        await expect.element(button1).not.toHaveFocus();
        await expect.element(button2).not.toHaveFocus();

        hook.rerender({ isEnabled: true });

        await expect.element(button1).toHaveFocus();
        await expect.element(button2).not.toHaveFocus();

        button1.blur();

        await expect.element(button1).not.toHaveFocus();

        hook.rerender({ isEnabled: true });

        await expect.element(button1).not.toHaveFocus();
        await expect.element(button2).not.toHaveFocus();
    });
});