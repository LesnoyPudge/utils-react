import { useRef } from 'react';
import { useMergeRefs } from './useMergeRefs';
import { page } from '@vitest/browser/context';
import { renderHook } from '@testing-library/react';



describe('useMergeRefs', () => {
    it('should merge multiple refs and update them correctly', () => {
        const refCallback = vi.fn();

        const hook = renderHook(() => {
            const ref1 = useRef<HTMLElement | null>(null);
            const ref2 = useRef<HTMLDivElement | null>(null);
            const mergedRef = useMergeRefs([ref1, ref2, refCallback]);

            return {
                ref1,
                ref2,
                mergedRef,
            };
        });

        const { mergedRef, ref1, ref2 } = hook.result.current;

        const screen = page.render(<div ref={mergedRef}>Test</div>);
        const div = screen.getByText('Test').element();

        expect(ref1.current).toBe(div);
        expect(ref2.current).toBe(div);
        expect(refCallback).toHaveBeenCalledExactlyOnceWith(div);
    });

    it('should accept null and undefined', () => {
        const spy = vi.fn();
        const hook = renderHook(() => {
            return useMergeRefs<number>([null, undefined, spy]);
        });

        hook.result.current(1);

        expect(spy).toBeCalledWith(1);
    });

    it('should return stable reference', () => {
        const spy = vi.fn();

        const hook = renderHook((refs: useMergeRefs.Props) => {
            return useMergeRefs(refs);
        }, { initialProps: [null] });

        const firstResult = hook.result.current;

        firstResult(null);

        hook.rerender([spy]);

        const secondResult = hook.result.current;

        secondResult(null);

        expect(spy).toHaveBeenCalledWith(null);
        expect(firstResult).toBe(secondResult);
    });
});