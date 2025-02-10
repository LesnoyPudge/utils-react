import { useRef } from 'react';
import { mergeRefs } from './mergeRefs';
import { page } from '@vitest/browser/context';
import { renderHook } from '@testing-library/react';



describe('mergeRefs', () => {
    it('should merge multiple refs and update them correctly', () => {
        const hook = renderHook(() => {
            const ref1 = useRef<HTMLElement | null>(null);
            const ref2 = useRef<HTMLDivElement | null>(null);

            return {
                ref1,
                ref2,
            };
        });

        const { ref1, ref2 } = hook.result.current;
        const refCallback = vi.fn();
        const ref = mergeRefs(ref1, ref2, refCallback);

        const screen = page.render(<div ref={ref}>Test</div>);
        const div = screen.getByText('Test').element();

        expect(ref1.current).toBe(div);
        expect(ref2.current).toBe(div);
        expect(refCallback).toHaveBeenCalledWith(div);
    });

    it('should accept null and undefined', () => {
        const spy = vi.fn();
        const ref = mergeRefs<number>(null, undefined, spy);

        ref(1);

        expect(spy).toBeCalledWith(1);
    });
});