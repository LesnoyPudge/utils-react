import { renderHook } from '@testing-library/react';
import { useLatest } from './useLatest';



describe('useLatest', () => {
    it('should return last result', () => {
        const hook = renderHook(
            ({ value }: { value: string }) => useLatest(value),
            { initialProps: { value: 'initial' } },
        );

        expect(hook.result.current.current).toBe('initial');

        hook.rerender({ value: 'updated' });

        expect(hook.result.current.current).toBe('updated');
    });

    it('should assign before effects', () => {
        let isUpdatedBeforeEffects = false;
        const updatedValue = 'updated';

        const hook = renderHook(
            ({ value }) => {
                const latest = useLatest(value);

                isUpdatedBeforeEffects = latest.current === updatedValue;

                return latest;
            },
            { initialProps: { value: 'initial' } },
        );

        hook.rerender({ value: updatedValue });

        expect(isUpdatedBeforeEffects).toBe(true);
    });
});