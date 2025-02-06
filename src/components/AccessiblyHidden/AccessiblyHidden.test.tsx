import { page } from '@vitest/browser/context';
import { AccessiblyHidden } from './AccessiblyHidden';



describe('AccessiblyHidden', () => {
    it('should be visible but with aria-hidden', async () => {
        const screen = page.render((
            <AccessiblyHidden>
                <>test</>
            </AccessiblyHidden>
        ));

        const elementLocator = screen.getByText('test');

        await expect.element(elementLocator).toBeInTheDocument();

        await expect.element(elementLocator).toBeVisible();

        await expect.element(
            elementLocator,
        ).toHaveAttribute('aria-hidden', 'true');
    });
});