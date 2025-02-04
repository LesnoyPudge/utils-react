import { FC, Suspense } from 'react';
import { createSleep } from './createSleep';
import { page } from '@vitest/browser/context';
import { act } from '@testing-library/react';
import { noop } from '@lesnoypudge/utils';



vi.useFakeTimers();

describe('createSleep', () => {
    it('should suspend and call console.log', async () => {
        const fallbackSpy = vi.fn();
        const innerSpy = vi.fn();
        const DURATION = 1_000;
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(noop);

        const Fallback: FC = () => {
            fallbackSpy();
            return null;
        };

        const Inner: FC = () => {
            innerSpy();
            return null;
        };

        const Sleep = createSleep(DURATION, 'test');

        const Test: FC = () => {
            return (
                <Suspense fallback={<Fallback/>}>
                    <Sleep>
                        <Inner/>
                    </Sleep>
                </Suspense>
            );
        };

        const screen = page.render(<Test/>);

        expect(consoleSpy).toBeCalledTimes(1);
        expect(fallbackSpy).toBeCalledTimes(1);
        expect(innerSpy).toBeCalledTimes(0);

        vi.advanceTimersByTime(DURATION / 2);

        screen.rerender(<Test/>);

        expect(consoleSpy).toBeCalledTimes(1);
        expect(fallbackSpy).toBeCalledTimes(2);
        expect(innerSpy).toBeCalledTimes(0);

        await act(() => vi.advanceTimersByTime(DURATION / 2));

        expect(consoleSpy).toBeCalledTimes(2);
        expect(fallbackSpy).toBeCalledTimes(2);
        expect(innerSpy).toBeCalledTimes(1);

        screen.rerender(<Test/>);

        expect(consoleSpy).toBeCalledTimes(2);
        expect(fallbackSpy).toBeCalledTimes(2);
        expect(innerSpy).toBeCalledTimes(2);
    });
});