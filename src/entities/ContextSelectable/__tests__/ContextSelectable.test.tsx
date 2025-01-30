import { FC, PropsWithChildren, useEffect } from 'react';
import { ContextSelectable } from '../index';
import { page } from '@vitest/browser/context';
import { useCounter } from '@hooks/useCounter';
import { act } from '@testing-library/react';



vi.useFakeTimers();

describe('ContextSelectable', () => {
    it('should be defined', () => {
        expect(ContextSelectable.ConsumerProxy).toBeDefined();
        expect(ContextSelectable.ConsumerSelector).toBeDefined();
        expect(ContextSelectable.createConsumerProxy).toBeDefined();
        expect(ContextSelectable.createContext).toBeDefined();
        expect(ContextSelectable.useProxy).toBeDefined();
        expect(ContextSelectable.useSelector).toBeDefined();

        expect(Object.keys(ContextSelectable).length).toBe(6);
    });

    it('components that do not consume state should not update', async () => {
        const DELAY = 1_000;
        const wrapperSpy = vi.fn();
        const countSpy = vi.fn();
        const buttonSpy = vi.fn();

        const CounterContext = ContextSelectable.createContext<
            useCounter.Return
        >();

        const Provider: FC<PropsWithChildren> = ({ children }) => {
            const counter = useCounter();

            const { increase } = counter;

            useEffect(() => {
                const id = setTimeout(() => {
                    increase();
                }, DELAY);

                return () => {
                    clearTimeout(id);
                };
            }, [increase]);

            return (
                <CounterContext.Provider value={counter}>
                    {children}
                </CounterContext.Provider>
            );
        };

        const Count: FC = () => {
            const {
                increase: _,
                count,
            } = ContextSelectable.useProxy(CounterContext);

            useEffect(countSpy);

            return (
                <div data-testid='Count'>
                    {count}
                </div>
            );
        };

        const Button: FC = () => {
            const {
                increase,
            } = ContextSelectable.useProxy(CounterContext);

            useEffect(buttonSpy);

            return (
                <button onClick={() => increase()}>
                    <>test</>
                </button>
            );
        };

        const Wrapper: FC = () => {
            useEffect(wrapperSpy);

            return (
                <Provider>
                    <Count/>

                    <Button/>
                </Provider>
            );
        };

        const screen = page.render(<Wrapper/>);

        const countLocator = screen.getByTestId('Count');
        const buttonLocator = screen.getByRole('button');

        expect(wrapperSpy).toBeCalledTimes(1);
        expect(countSpy).toBeCalledTimes(1);
        expect(buttonSpy).toBeCalledTimes(1);

        await expect.element(countLocator).toHaveTextContent('0');

        await act(() => vi.advanceTimersByTime(DELAY));

        expect(wrapperSpy).toBeCalledTimes(1);
        expect(countSpy).toBeCalledTimes(2);
        expect(buttonSpy).toBeCalledTimes(1);

        await expect.element(countLocator).toHaveTextContent('1');

        await buttonLocator.click();

        expect(wrapperSpy).toBeCalledTimes(1);
        expect(countSpy).toBeCalledTimes(3);
        expect(buttonSpy).toBeCalledTimes(1);

        await expect.element(countLocator).toHaveTextContent('2');
    });
});