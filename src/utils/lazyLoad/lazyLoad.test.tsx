import { page } from '@vitest/browser/context';
import { lazyLoad } from './lazyLoad';
import { FC, Suspense } from 'react';
import { ErrorBoundary } from '@entities/ErrorBoundary';
import { noop } from '@lesnoypudge/utils';
import { act } from '@testing-library/react';



vi.useFakeTimers();

describe('lazyLoad', () => {
    describe('modifiedReactLazy', () => {
        it('should recover after component is failed to load', async () => {
            vi.spyOn(console, 'error').mockImplementation(noop);

            const errorSpy = vi.fn();

            const componentSpy = (
                vi.fn()
                    .mockRejectedValueOnce(new Error('test'))
                    .mockResolvedValueOnce({
                        default: () => <div>Component1</div>,
                    })
            );

            const LazyComponent = lazyLoad.modifiedReactLazy(
                componentSpy,
            );

            expect(componentSpy).toBeCalledTimes(0);

            const Test1 = () => (
                <ErrorBoundary.Node onError={errorSpy}>
                    <Suspense>
                        <LazyComponent/>
                    </Suspense>
                </ErrorBoundary.Node>
            );

            const screen1 = page.render(<Test1/>);
            const firstComponentLocator1 = screen1.getByText('Component1');

            await vi.waitFor(() => {
                expect(componentSpy).toBeCalledTimes(1);
                expect(errorSpy).toBeCalledTimes(1);
            });

            screen1.unmount();

            page.render(<Test1/>);

            await expect.element(firstComponentLocator1).toBeInTheDocument();

            await vi.waitFor(() => {
                expect(componentSpy).toBeCalledTimes(2);
                expect(errorSpy).toBeCalledTimes(1);
            });
        });
    });

    describe('withDelay', () => {
        it('should resolve after provided delay', async () => {
            const DELAY = 1_000;

            const promiseValue = {
                default: () => null,
            };

            const spy = vi.fn().mockResolvedValue(promiseValue);

            const lazyTrigger = lazyLoad.withDelay(spy, {
                isDev: true, delay: DELAY,
            });

            const promise = lazyTrigger();

            // spy should be called without delay
            expect(spy).toBeCalledTimes(1);

            await vi.advanceTimersByTimeAsync(DELAY);

            await expect(promise).resolves.toBe(promiseValue);
        });
    });

    describe('createPreloadGroup', () => {
        it('should not resolve until all components is loaded', async () => {
            const SMALL_DELAY = 1_000;
            const BIG_DELAY = 3_000;

            const firstComponentSpy = vi.fn(() => Promise.resolve({
                default: () => <div>Component1</div>,
            }));

            const secondComponentSpy = vi.fn(() => Promise.resolve({
                default: () => <div>Component2</div>,
            }));

            const preloadGroup = lazyLoad.createPreloadGroup();

            const LazyComponent1 = lazyLoad.modifiedReactLazy(
                preloadGroup.withPreloadGroup(
                    lazyLoad.withDelay(
                        firstComponentSpy,
                        { delay: SMALL_DELAY, isDev: true },
                    ),
                ),
            );

            const LazyComponent2 = lazyLoad.modifiedReactLazy(
                preloadGroup.withPreloadGroup(
                    lazyLoad.withDelay(
                        secondComponentSpy,
                        { delay: BIG_DELAY, isDev: true },
                    ),
                ),
            );

            const Test: FC<{ flag: boolean }> = ({ flag }) => {
                if (flag) {
                    return (
                        <Suspense>
                            <LazyComponent1/>
                        </Suspense>
                    );
                }

                return (
                    <Suspense>
                        <LazyComponent2/>
                    </Suspense>
                );
            };

            expect(firstComponentSpy).toBeCalledTimes(0);
            expect(secondComponentSpy).toBeCalledTimes(0);

            const screen = page.render(<Test flag={true}/>);

            const firstComponentLocator = screen.getByText('Component1');
            const secondComponentLocator = screen.getByText('Component2');

            await vi.waitFor(() => {
                expect(firstComponentSpy).toBeCalledTimes(1);
                expect(secondComponentSpy).toBeCalledTimes(1);
            });

            await expect.element(
                firstComponentLocator,
            ).not.toBeInTheDocument();

            await expect.element(
                secondComponentLocator,
            ).not.toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(SMALL_DELAY);
            });

            await expect.element(
                firstComponentLocator,
            ).not.toBeInTheDocument();

            await expect.element(
                secondComponentLocator,
            ).not.toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(BIG_DELAY - SMALL_DELAY);
            });

            await expect.element(
                firstComponentLocator,
            ).toBeInTheDocument();

            await expect.element(
                secondComponentLocator,
            ).not.toBeInTheDocument();

            screen.rerender(<Test flag={false}/>);

            await expect.element(
                firstComponentLocator,
            ).not.toBeInTheDocument();

            await expect.element(
                secondComponentLocator,
            ).toBeInTheDocument();

            expect(firstComponentSpy).toBeCalledTimes(1);
            expect(secondComponentSpy).toBeCalledTimes(1);
        });
    });

    describe('createAsyncLoadGroup', () => {
        it('should load called component and fetch others', async () => {
            const SMALL_DELAY = 20_000;
            const BIG_DELAY = 50_000;

            const firstComponentSpy = vi.fn(() => Promise.resolve({
                default: () => <div>Component1</div>,
            }));

            const secondComponentSpy = vi.fn(() => Promise.resolve({
                default: () => <div>Component2</div>,
            }));

            const preloadGroup = lazyLoad.createAsyncLoadGroup();

            const LazyComponent1 = lazyLoad.modifiedReactLazy(
                preloadGroup.withAsyncLoadGroup(
                    lazyLoad.withDelay(
                        firstComponentSpy,
                        { delay: SMALL_DELAY, isDev: true },
                    ),
                ),
            );

            const LazyComponent2 = lazyLoad.modifiedReactLazy(
                preloadGroup.withAsyncLoadGroup(
                    lazyLoad.withDelay(
                        secondComponentSpy,
                        { delay: BIG_DELAY, isDev: true },
                    ),
                ),
            );

            const Test: FC<{ flag: boolean }> = ({ flag }) => {
                if (flag) {
                    return (
                        <Suspense>
                            <LazyComponent1/>
                        </Suspense>
                    );
                }

                return (
                    <Suspense>
                        <LazyComponent2/>
                    </Suspense>
                );
            };

            expect(firstComponentSpy).toBeCalledTimes(0);
            expect(secondComponentSpy).toBeCalledTimes(0);

            const screen = page.render(<Test flag={true}/>);

            const firstComponentLocator = page.getByText('Component1');
            const secondComponentLocator = page.getByText('Component2');

            await vi.waitFor(() => {
                expect(firstComponentSpy).toBeCalledTimes(1);
                expect(secondComponentSpy).toBeCalledTimes(1);
            });

            await expect.element(
                firstComponentLocator,
            ).not.toBeInTheDocument();

            await expect.element(
                secondComponentLocator,
            ).not.toBeInTheDocument();

            await act(async () => {
                await vi.advanceTimersByTimeAsync(SMALL_DELAY);
            });

            await expect.element(
                firstComponentLocator,
            ).toBeInTheDocument();

            await expect.element(
                secondComponentLocator,
            ).not.toBeInTheDocument();

            screen.rerender(<Test flag={false}/>);

            await act(async () => {
                await vi.advanceTimersByTimeAsync(BIG_DELAY - SMALL_DELAY);
            });

            await expect.element(
                firstComponentLocator,
            ).not.toBeInTheDocument();

            await expect.element(
                secondComponentLocator,
            ).toBeInTheDocument();

            expect(firstComponentSpy).toBeCalledTimes(1);
            expect(secondComponentSpy).toBeCalledTimes(1);
        });
    });
});