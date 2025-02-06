import { page } from '@vitest/browser/context';
import { Static } from './Static';
import { FC, PropsWithChildren } from 'react';



describe('Static', () => {
    it('should prevent any changes to provided children', async () => {
        const renderSpy = vi.fn();

        const Inner: FC<(
            PropsWithChildren
            & { deep: { value: number } }
        )> = ({ deep, children }) => {
            renderSpy();

            return (
                <div data-testid='test'>
                    {deep.value}

                    {children}
                </div>
            );
        };

        const screen = page.render((
            <Static>
                <Inner deep={{ value: 1 }}>
                    <>1</>
                </Inner>
            </Static>
        ));

        const elementLocator = screen.getByTestId('test');

        expect(renderSpy).toBeCalledTimes(1);
        await expect.element(elementLocator).toHaveTextContent('11');

        screen.rerender((
            <Static>
                <Inner deep={{ value: 1 }}>
                    <>1</>
                </Inner>
            </Static>
        ));

        screen.rerender((
            <Static>
                <Inner deep={{ value: 2 }}>
                    <>1</>
                </Inner>
            </Static>
        ));

        screen.rerender((
            <Static>
                <Inner deep={{ value: 2 }}>
                    <>2</>
                </Inner>
            </Static>
        ));

        expect(renderSpy).toBeCalledTimes(1);
        await expect.element(elementLocator).toHaveTextContent('11');
    });
});