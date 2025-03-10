import { page } from '@vitest/browser/context';
import { Hidden } from '../index';



describe('Hidden', () => {
    describe('Accessibly', () => {
        it('should be visible but with aria-hidden', async () => {
            const screen = page.render((
                <Hidden.Accessibly>
                    <>test</>
                </Hidden.Accessibly>
            ));

            const elementLocator = screen.getByText('test');

            await expect.element(elementLocator).toBeInTheDocument();

            await expect.element(elementLocator).toBeVisible();

            await expect.element(
                elementLocator,
            ).toHaveAttribute('aria-hidden', 'true');
        });
    });

    describe('Fully', () => {
        it('should be visually invisible and accessibly hidden', async () => {
            const screen = page.render((
                <Hidden.Fully>
                    <>test</>
                </Hidden.Fully>
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

    describe('Visually', () => {
        it('should be `visibly invisible`', async () => {
            const screen = page.render((
                <Hidden.Visually>
                    <>test</>
                </Hidden.Visually>
            ));

            const elementLocator = screen.getByText('test');

            await expect.element(elementLocator).toBeInTheDocument();
            await expect.element(elementLocator).toBeVisible();

            const element = elementLocator.element();

            expect(element.clientWidth).toBe(1);
            expect(element.clientHeight).toBe(1);
        });
    });
});