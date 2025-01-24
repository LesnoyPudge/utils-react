import { useMutationObserver } from './useMutationObserver';
import { FC } from 'react';
import { useRefManager } from '@entities/RefManager';
import { page } from '@vitest/browser/context';
import { sleep } from '@lesnoypudge/utils';



describe('useMutationObserver', () => {
    it('should call callback on mutation', async () => {
        const spy = vi.fn();
        const Test: FC<{ value: number }> = ({ value }) => {
            const ref = useRefManager<HTMLDivElement>(null);

            useMutationObserver(ref, () => {
                console.log('???');
                spy();
            }, { attributes: true });

            return (
                <div ref={ref} data-value={value}>test</div>
            );
        };

        const screen = page.render(<Test value={0}/>);

        await sleep(100);

        screen.rerender(<Test value={1}/>);

        await sleep(100);

        expect(spy).toHaveBeenCalledTimes(1);
        await vi.waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
    });
});