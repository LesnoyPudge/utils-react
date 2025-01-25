import { renderHook } from '@testing-library/react';
import { useResizeObserver } from './useResizeObserver';
import { FC } from 'react';
import { useRefManager } from '@entities/RefManager';
import { page } from '@vitest/browser/context';



describe('useResizeObserver', () => {
    it('should trigger callback', async () => {
        const spy = vi.fn();

        const Test: FC<{ flag: boolean }> = ({ flag }) => {
            const ref = useRefManager<HTMLDivElement>(null);

            useResizeObserver(ref, spy);

            return (
                <div ref={ref}>
                    {flag ? 'test' : null}
                </div>
            );
        };

        const screen = page.render(<Test flag={false}/>);

        await vi.waitFor(() => {
            expect(spy).toBeCalledTimes(0);
        });

        screen.rerender(<Test flag={true}/>);

        await vi.waitFor(() => {
            expect(spy).toBeCalledTimes(1);
        });
    });
});