import { page } from '@vitest/browser/context';
import { ErrorThrower } from './ErrorThrower';
import { ErrorBoundary } from '@entities/ErrorBoundary';
import { noop } from '@lesnoypudge/utils';



describe('ErrorThrower', () => {
    it('should throw error when rendered', () => {
        const spy = vi.fn();
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(noop);
        const message = '__TEST__';

        page.render((
            <ErrorBoundary.Node onError={spy}>
                <ErrorThrower message={message}/>
            </ErrorBoundary.Node>
        ));

        expect(spy).toBeCalledTimes(1);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const messageFromLoggedError = consoleSpy.mock.calls[0]?.[0]?.message;

        expect(messageFromLoggedError).toBe(message);
    });

    it('should not throw error if disabled', () => {
        const spy = vi.fn();

        page.render((
            <ErrorBoundary.Node onError={spy}>
                <ErrorThrower disable/>
            </ErrorBoundary.Node>
        ));

        expect(spy).toBeCalledTimes(0);
    });
});