import { page } from '@vitest/browser/context';
import { FC } from 'react';
import { Heading } from '../index';



describe('Heading', () => {
    it('should render h1', async () => {
        const Test: FC = () => {
            return (
                <Heading.Node>
                    <>test</>
                </Heading.Node>
            );
        };
        const screen = page.render(<Test/>);
        const element = screen.getByText('test');

        await expect.element(element).toBeVisible();
        expect(element.element().tagName).toBe('H1');
    });

    it('should render nested h2', async () => {
        const Test: FC = () => {
            return (
                <Heading.Provider>
                    <Heading.Node>
                        <>test</>
                    </Heading.Node>
                </Heading.Provider>
            );
        };
        const screen = page.render(<Test/>);
        const element = screen.getByText('test');

        await expect.element(element).toBeVisible();
        expect(element.element().tagName).toBe('H2');
    });

    it('nested providers should add up', async () => {
        const Test: FC = () => {
            return (
                <Heading.Provider>
                    <Heading.Provider>
                        <Heading.Node>
                            <>test</>
                        </Heading.Node>
                    </Heading.Provider>
                </Heading.Provider>
            );
        };
        const screen = page.render(<Test/>);
        const element = screen.getByText('test');

        await expect.element(element).toBeVisible();
        expect(element.element().tagName).toBe('H3');
    });
});