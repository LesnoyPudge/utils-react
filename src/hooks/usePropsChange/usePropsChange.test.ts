import { renderHook } from '@testing-library/react';
import { usePropsChange } from './usePropsChange';
import { noop } from '@lesnoypudge/utils';



describe('usePropsChange', () => {
    it('should log diff when props shallowly change', () => {
        const spy = vi.spyOn(console, 'log').mockImplementation(noop);
        const hook = renderHook((props) => usePropsChange(props), {
            initialProps: { value: 1 },
        });

        expect(spy).toBeCalledTimes(0);

        hook.rerender({ value: 1 });

        expect(spy).toBeCalledTimes(0);

        hook.rerender({ value: 2 });

        expect(spy).toHaveBeenCalledTimes(1);
    });
});