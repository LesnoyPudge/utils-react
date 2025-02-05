import { FC } from 'react';
import { createHookComponent } from './createHookComponent';
import { useCounter } from '@hooks/useCounter';
import { page } from '@vitest/browser/context';



describe('createHookComponent', () => {
    it('should accept render function as child', async () => {
        const HookComponent = createHookComponent(
            'Counter',
            () => useCounter(),
        );

        const Test: FC = () => {
            return (
                <HookComponent>
                    {({ count, increase }) => (
                        <div>
                            <div data-testid='count'>{count}</div>

                            <button onClick={() => increase()}>test</button>
                        </div>
                    )}
                </HookComponent>
            );
        };

        const screen = page.render(<Test/>);
        const countLocator = screen.getByTestId('count');
        const buttonLocator = screen.getByRole('button');

        await expect.element(countLocator).toHaveTextContent('0');

        await buttonLocator.click();

        await expect.element(countLocator).toHaveTextContent('1');
    });

    it('should require props', async () => {
        const HookComponent = createHookComponent(
            'Counter',
            (
                initialValueA: number,
                initialValueB: number,
            ) => useCounter(initialValueA + initialValueB),
        );

        const Test: FC = () => {
            return (
                <HookComponent args={[2, 3]}>
                    {({ count }) => (
                        <div data-testid='count'>{count}</div>
                    )}
                </HookComponent>
            );
        };

        const screen = page.render(<Test/>);
        const countLocator = screen.getByTestId('count');

        await expect.element(countLocator).toHaveTextContent('5');
    });
});