import { renderHook } from '@testing-library/react';
import { useHotKey } from './useHotKey';
import { KEY } from '@lesnoypudge/utils';
import { userEvent } from '@vitest/browser/context';



describe('useHotKey', () => {
    it('should trigger callback when hotkey is pressed', async () => {
        const spy = vi.fn();
        const hook = renderHook(() => useHotKey(document, [KEY.A], spy));

        await userEvent.keyboard(KEY.A);

        expect(spy).toBeCalledTimes(1);

        hook.unmount();

        expect(spy).toBeCalledTimes(1);
    });
});