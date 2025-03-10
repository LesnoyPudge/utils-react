import { page } from '@vitest/browser/context';
import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useState,
} from 'react';
import { RenderResult } from 'vitest-browser-react';
import { act } from '@testing-library/react';
import { Memo } from '../index';



const setup = () => {
    const renderSpy = vi.fn();

    const TestContext = createContext(0);

    const Inner: FC<(
            PropsWithChildren
            & { deep: { value: number } }
    )> = ({ deep, children }) => {
        const count = useContext(TestContext);

        renderSpy();

        return (
            <div data-testid='test'>
                {deep.value + count}

                {children}
            </div>
        );
    };

    let outerSetCount: Dispatch<SetStateAction<number>>;

    const updateContext = () => {
        act(() => outerSetCount((prev) => prev + 1));
    };

    const DeepWithTestContext = () => {
        const [count, setCount] = useState(0);

        // eslint-disable-next-line react-compiler/react-compiler
        outerSetCount = setCount;

        return (
            <TestContext.Provider value={count}>
                <Memo.Deep>
                    <Inner deep={{ value: 1 }}>
                        <>1</>
                    </Inner>
                </Memo.Deep>
            </TestContext.Provider>
        );
    };

    const StaticWithTestContext = () => {
        const [count, setCount] = useState(0);

        // eslint-disable-next-line react-compiler/react-compiler
        outerSetCount = setCount;

        return (
            <TestContext.Provider value={count}>
                <Memo.Static>
                    <Inner deep={{ value: 1 }}>
                        <>1</>
                    </Inner>
                </Memo.Static>
            </TestContext.Provider>
        );
    };

    const getLocator = (screen: RenderResult) => {
        const elementLocator = screen.getByTestId('test');
        return {
            elementLocator,
        };
    };

    return {
        getLocator,
        updateContext,
        renderSpy,
        DeepWithTestContext,
        StaticWithTestContext,
        Inner,
    };
};

describe('Memo', () => {
    describe('Deep', () => {
        it(`
            should prevent rerenders when passed children are deep equal    
        `, async () => {
            const { getLocator, renderSpy, Inner } = setup();

            const screen = page.render((
                <Memo.Deep>
                    <Inner deep={{ value: 1 }}>
                        <>1</>
                    </Inner>
                </Memo.Deep>
            ));

            const { elementLocator } = getLocator(screen);

            // initial render
            expect(renderSpy).toBeCalledTimes(1);
            await expect.element(elementLocator).toHaveTextContent('1');

            screen.rerender((
                <Memo.Deep>
                    <Inner deep={{ value: 1 }}>
                        <>1</>
                    </Inner>
                </Memo.Deep>
            ));

            // rerender with same props
            expect(renderSpy).toBeCalledTimes(1);

            screen.rerender((
                <Memo.Deep>
                    <Inner deep={{ value: 2 }}>
                        <>1</>
                    </Inner>
                </Memo.Deep>
            ));

            // rerender with new Inner.props.deep value
            expect(renderSpy).toBeCalledTimes(2);

            screen.rerender((
                <Memo.Deep>
                    <Inner deep={{ value: 2 }}>
                        <>2</>
                    </Inner>
                </Memo.Deep>
            ));

            // rerender with new Inner.props.children
            expect(renderSpy).toBeCalledTimes(3);
            await expect.element(elementLocator).toHaveTextContent('2');
        });

        it('should rerender on context update', async () => {
            const {
                DeepWithTestContext,
                getLocator,
                renderSpy,
                updateContext,
            } = setup();

            const screen = page.render(<DeepWithTestContext/>);
            const { elementLocator } = getLocator(screen);

            expect(renderSpy).toBeCalledTimes(1);
            await expect.element(elementLocator).toHaveTextContent('11');

            updateContext();

            expect(renderSpy).toBeCalledTimes(2);
            await expect.element(elementLocator).toHaveTextContent('21');
        });
    });

    describe('Static', () => {
        it(`
            should prevent any changes to provided children 
            caused by prop change    
        `, async () => {
            const {
                Inner,
                getLocator,
                renderSpy,
            } = setup();

            const screen = page.render((
                <Memo.Static>
                    <Inner deep={{ value: 1 }}>
                        <>1</>
                    </Inner>
                </Memo.Static>
            ));

            const { elementLocator } = getLocator(screen);

            expect(renderSpy).toBeCalledTimes(1);
            await expect.element(elementLocator).toHaveTextContent('11');

            screen.rerender((
                <Memo.Static>
                    <Inner deep={{ value: 1 }}>
                        <>1</>
                    </Inner>
                </Memo.Static>
            ));

            screen.rerender((
                <Memo.Static>
                    <Inner deep={{ value: 2 }}>
                        <>1</>
                    </Inner>
                </Memo.Static>
            ));

            screen.rerender((
                <Memo.Static>
                    <Inner deep={{ value: 2 }}>
                        <>2</>
                    </Inner>
                </Memo.Static>
            ));

            expect(renderSpy).toBeCalledTimes(1);
            await expect.element(elementLocator).toHaveTextContent('11');
        });

        it('should rerender on context update', async () => {
            const {
                StaticWithTestContext,
                getLocator,
                renderSpy,
                updateContext,
            } = setup();

            const screen = page.render(<StaticWithTestContext/>);
            const { elementLocator } = getLocator(screen);

            expect(renderSpy).toBeCalledTimes(1);
            await expect.element(elementLocator).toHaveTextContent('11');

            updateContext();

            expect(renderSpy).toBeCalledTimes(2);
            await expect.element(elementLocator).toHaveTextContent('21');
        });
    });
});