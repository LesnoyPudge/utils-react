import { page } from '@vitest/browser/context';
import { useIntersectionObserver } from './useIntersectionObserver';
import { CSSProperties, FC } from 'react';
import { useRefManager } from '@hooks/useRefManager';



describe('useIntersectionObserver', () => {
    it('should track element`s intersection', async () => {
        const spy = vi.fn();

        const Test: FC<{ visible: boolean }> = ({ visible }) => {
            const ref = useRefManager<HTMLDivElement>(null);

            useIntersectionObserver(ref, (entry) => {
                spy(entry.isIntersecting);
            });

            const style: CSSProperties = {
                position: 'fixed',
                left: visible ? 0 : '-9999px',
            };

            return (
                <div ref={ref} style={style}>test</div>
            );
        };

        const screen = page.render(<Test visible={true}/>);

        await vi.waitFor(() => {
            expect(spy).toBeCalledTimes(1);
            expect(spy).lastCalledWith(true);
        });

        screen.rerender(<Test visible={false}/>);

        await vi.waitFor(() => {
            expect(spy).toBeCalledTimes(2);
            expect(spy).lastCalledWith(false);
        });
    });
});