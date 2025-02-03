import { page } from '@vitest/browser/context';
import { renderFunction } from './renderFunction';
import { FC } from 'react';
import { RT } from '@lesnoypudge/types-utils-react/namespace';



const Test: FC<RT.PropsWithRenderFunctionOrNode<
    [{ a: number; b: number }]
>> = ({
    children,
}) => {
    return renderFunction(children, { a: 2, b: 3 });
};

describe('renderFunction', () => {
    it('should return children directly', async () => {
        const Wrapped: FC = () => {
            return (
                <Test>
                    <div>Test</div>
                </Test>
            );
        };

        const screen = page.render(<Wrapped/>);

        const innerLocator = screen.getByText('Test');

        await expect.element(innerLocator).toBeInTheDocument();
        expect(innerLocator.element().tagName).toBe('DIV');
    });

    it('should call the render function with props', async () => {
        const Wrapped: FC = () => {
            return (
                <Test>
                    {({ a, b }) => (
                        <div>{a + b}</div>
                    )}
                </Test>
            );
        };

        const screen = page.render(<Wrapped/>);

        const innerLocator = screen.getByText('5');

        await expect.element(innerLocator).toBeInTheDocument();
        expect(innerLocator.element().tagName).toBe('DIV');
    });

    it('should call the render function with multiple arguments', async () => {
        const renderSpy = vi.fn((a: number, b: number) => {
            return (
                <>{a + b}</>
            );
        });

        const Test: FC = () => {
            return renderFunction(renderSpy, 2, 3);
        };

        const screen = page.render(<Test/>);

        expect(renderSpy).toHaveBeenCalledWith(2, 3);

        await expect.element(screen.getByText('5')).toBeInTheDocument();
    });
});