import { useIsFocusedWithin } from './useIsFocusedWithin';
import { page, userEvent } from '@vitest/browser/context';
import { useRefManager } from '@entities/RefManager';
import { useEffect } from 'react';



describe('useIsFocusedWithin', () => {
    it('should track focus within the container', async () => {
        const spy = vi.fn();

        const Test = () => {
            const ref = useRefManager<HTMLDivElement>(null);
            const { isFocusedWithin } = useIsFocusedWithin(ref);

            useEffect(() => {
                spy(isFocusedWithin);
            }, [isFocusedWithin]);

            return (
                <div ref={ref}>
                    <button>test</button>
                </div>
            );
        };

        const screen = page.render(<Test/>);
        const button = screen.getByText('test');

        await expect.element(button).not.toHaveFocus();
        expect(spy).toBeCalledTimes(1);
        expect(spy).lastCalledWith(false);

        await userEvent.tab();

        await expect.element(button).toHaveFocus();
        expect(spy).toBeCalledTimes(2);
        expect(spy).lastCalledWith(true);

        await userEvent.tab({ shift: true });

        await expect.element(button).not.toHaveFocus();
        expect(spy).toBeCalledTimes(3);
        expect(spy).lastCalledWith(false);
    });
});