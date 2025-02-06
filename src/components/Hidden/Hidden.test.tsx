import { page } from '@vitest/browser/context';
import { Hidden } from './Hidden';



describe('Hidden', () => {
    it('should be visually invisible and accessibly hidden', async () => {
        const screen = page.render((
            <Hidden>
                <>test</>
            </Hidden>
        ));

        const elementLocator = screen.getByText('test');

        await expect.element(elementLocator).toBeInTheDocument();

        await expect.element(elementLocator).toBeVisible();

        await expect.element(
            elementLocator,
        ).toHaveAttribute('aria-hidden', 'true');

        const element = elementLocator.element();

        expect(element.clientWidth).toBe(1);
        expect(element.clientHeight).toBe(1);
    });
});