import { useClickOutside } from './useClickOutside';
import { useRefManager } from '@hooks/useRefManager';
import { page } from '@vitest/browser/context';



describe('useClickOutside', () => {
    it('should call callback on click outside of inner', async () => {
        const spy = vi.fn();

        const Test = () => {
            const innerRef = useRefManager<HTMLDivElement>(null);

            useClickOutside(innerRef, spy);

            return (
                <div data-testid='container' style={{ padding: 20 }}>
                    <div>outer</div>

                    <div ref={innerRef}>
                        <>inner</>
                    </div>
                </div>
            );
        };

        const { getByTestId } = page.render(<Test/>);

        const container = getByTestId('container');
        const inner = container.getByText('inner');
        const outer = container.getByText('outer');

        await inner.click();

        expect(spy).toBeCalledTimes(0);

        await container.click({ position: { x: 0, y: 0 } });
        await outer.click();

        expect(spy).toBeCalledTimes(2);
    });
});