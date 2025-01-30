import { FC, useContext } from 'react';
import { ErrorBoundary } from '../index';
import { ErrorThrower } from '@components/ErrorThrower';
import { page, userEvent } from '@vitest/browser/context';
import { noop } from '@lesnoypudge/utils';



describe('ErrorBoundary', () => {
    it('should trigger callback on error and reset', async () => {
        const errorSpy = vi.fn();
        const resetSpy = vi.fn();
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(noop);

        const Fallback: FC = () => {
            const { resetErrorBoundary } = useContext(ErrorBoundary.Context);

            return (
                <button onClick={resetErrorBoundary}>
                    <>test</>
                </button>
            );
        };

        const Test: FC = () => {
            return (
                <ErrorBoundary.Node
                    onError={errorSpy}
                    onReset={resetSpy}
                    FallbackComponent={Fallback}
                >
                    <ErrorThrower/>
                </ErrorBoundary.Node>
            );
        };

        const screen = page.render(<Test/>);
        const button = screen.getByRole('button');

        expect(errorSpy).toBeCalledTimes(1);
        expect(resetSpy).toBeCalledTimes(0);
        expect(consoleSpy).toBeCalled();

        await userEvent.click(button.element());

        expect(errorSpy).toBeCalledTimes(2);
        expect(resetSpy).toBeCalledTimes(1);
    });
});