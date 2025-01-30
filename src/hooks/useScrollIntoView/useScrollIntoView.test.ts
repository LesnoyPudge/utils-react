import { renderHook } from '@testing-library/react';
import { useScrollIntoView } from './useScrollIntoView';
import { useRefManager } from '@hooks/useRefManager';



describe('useScrollIntoView', () => {
    it('should trigger scrollIntoView function', () => {
        const hook = renderHook(({ enabled }) => useScrollIntoView(
            useRefManager(document.body),
            { enabled },
        ), { initialProps: { enabled: false } });

        const spy = vi.spyOn(document.body, 'scrollIntoView');

        expect(spy).toBeCalledTimes(0);

        hook.result.current.scrollIntoView();

        expect(spy).toBeCalledTimes(1);

        hook.rerender({ enabled: true });

        expect(spy).toBeCalledTimes(2);
    });
});