import { renderHook } from '@testing-library/react';
import { useSynchronizedAnimation } from './useSynchronizedAnimation';
import { useRefManager } from '@entities/RefManager';



describe('useSynchronizedAnimation', () => {
    it('should synchronize animations', () => {
        const element = document.createElement('div');
        document.body.append(element);

        const spy = vi.spyOn(
            Element.prototype,
            'getAnimations',
        ).mockReturnValue([{ startTime: 10 } as Animation]);

        renderHook(() => useSynchronizedAnimation(useRefManager(element)));

        expect(spy).toBeCalledTimes(1);
        expect(element.getAnimations()[0]?.startTime).toBe(0);

        spy.mockRestore();
    });
});