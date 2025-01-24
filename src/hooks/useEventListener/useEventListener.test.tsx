import { useEventListener } from './useEventListener';
import { page } from '@vitest/browser/context';



describe('useEventListener', () => {
    it('should trigger callback on click', () => {
        const spy = vi.fn();

        const Test = () => {
            useEventListener(document, 'click', spy);
            return null;
        };

        const screen = page.render(<Test/>);

        screen.baseElement.click();

        expect(spy).toBeCalledTimes(1);

        screen.rerender(<Test/>);

        screen.baseElement.click();

        expect(spy).toBeCalledTimes(2);

        screen.unmount();

        screen.baseElement.click();

        expect(spy).toBeCalledTimes(2);
    });
});