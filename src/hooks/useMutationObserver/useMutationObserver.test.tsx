import { useMutationObserver } from './useMutationObserver';
import { FC } from 'react';
import { useRefManager } from '@entities/RefManager';
import { page } from '@vitest/browser/context';



describe('useMutationObserver', () => {
    it('should call callback on mutation', async () => {
        const spy = vi.fn();
        const Test: FC<{ value: number }> = ({ value }) => {
            const ref = useRefManager<HTMLDivElement>(null);

            useMutationObserver(ref, spy, { attributes: true });

            return (
                <div ref={ref} data-value={value}></div>
            );
        };

        const screen = page.render(<Test value={0}/>);

        await vi.waitFor(() => {
            expect(spy).toBeCalledTimes(0);
        });

        screen.rerender(<Test value={1}/>);

        await vi.waitFor(() => {
            expect(spy).toBeCalledTimes(1);
        });
    });
});