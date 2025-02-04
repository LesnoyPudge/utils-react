import { createContext, FC, useContext } from 'react';
import { createWithDecorator } from './createWithDecorator';
import { useCounter } from '@hooks/useCounter';
import { page } from '@vitest/browser/context';



describe('createWithDecorator', () => {
    it('should wrap provided component', async () => {
        const CounterContext = createContext<useCounter.Return>();

        const { withDecorator } = createWithDecorator(({ children }) => {
            const counter = useCounter();

            return (
                <CounterContext.Provider value={counter}>
                    {children}
                </CounterContext.Provider>
            );
        });

        const Test: FC = withDecorator(() => {
            const counter = useContext(CounterContext);

            return (
                <div data-testid='count'>{counter.count}</div>
            );
        });

        const screen = page.render(<Test/>);

        const countLocator = screen.getByTestId('count');

        await expect.element(countLocator).toHaveTextContent('0');
    });

    it('wrapped element should require additional props', async () => {
        const {
            withDecorator,
        } = createWithDecorator<{ value: number }>(({ children, value }) => {
            return (
                <div>
                    {children}

                    <div data-testid='extraValue'>{value}</div>
                </div>
            );
        });

        const Test = withDecorator(() => {
            return null;
        });

        const screen = page.render(<Test value={5}/>);

        await expect.element(
            screen.getByTestId('extraValue'),
        ).toHaveTextContent('5');
    });
});