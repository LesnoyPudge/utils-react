import { page } from '@vitest/browser/context';
import { ControllableStrictMode } from './ControllableStrictMode';
import { FC } from 'react';



describe('ControllableStrictMode', () => {
    it('should render components twice when enabled', () => {
        const spy = vi.fn();

        const Inner = () => {
            spy();

            return null;
        };

        const Test: FC<{ isEnabled: boolean }> = ({ isEnabled }) => {
            return (
                <ControllableStrictMode isEnabled={isEnabled}>
                    <Inner/>
                </ControllableStrictMode>
            );
        };

        const screen = page.render(<Test isEnabled={false}/>);

        expect(spy).toBeCalledTimes(1);

        screen.rerender(<Test isEnabled={true}/>);

        expect(spy).toBeCalledTimes(3);
    });
});