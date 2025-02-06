import { page } from '@vitest/browser/context';
import { VisuallyHidden } from './VisuallyHidden';



describe('VisuallyHidden', () => {
    it('should be `visibly invisible`', async () => {
        const screen = page.render((
            <VisuallyHidden>
                <>test</>
            </VisuallyHidden>
        ));

        const elementLocator = screen.getByText('test');

        await expect.element(elementLocator).toBeInTheDocument();
        await expect.element(elementLocator).toBeVisible();

        const element = elementLocator.element();

        expect(element.clientWidth).toBe(1);
        expect(element.clientHeight).toBe(1);
    });
});