import { page } from '@vitest/browser/context';
import { lazyLoad } from './lazyLoad';
import { FC, Suspense } from 'react';
import { act } from '@testing-library/react';
import { ErrorBoundary } from '@entities/ErrorBoundary';



vi.useFakeTimers();

describe('lazyLoad', () => {
    describe('createPreloadGroup', () => {
        // it('should preload all components', async () => {
        //     const SMALL_DELAY = 1_000;
        //     const BIG_DELAY = 3_000;

        //     const firstComponentSpy = vi.fn(() => Promise.resolve({
        //         default: () => <div>Component1</div>,
        //     }));

        //     const secondComponentSpy = vi.fn(() => Promise.resolve({
        //         default: () => <div>Component2</div>,
        //     }));

        //     const preloadGroup = lazyLoad.createPreloadGroup();

        //     const LazyComponent1 = lazyLoad.reactLazy(
        //         preloadGroup.withPreloadGroup(
        //             lazyLoad.withDelay(
        //                 firstComponentSpy,
        //                 { delay: SMALL_DELAY, isDev: true },
        //             ),
        //         ),
        //     );

        //     const LazyComponent2 = lazyLoad.reactLazy(
        //         preloadGroup.withPreloadGroup(
        //             lazyLoad.withDelay(
        //                 secondComponentSpy,
        //                 { delay: BIG_DELAY, isDev: true },
        //             ),
        //         ),
        //     );

        //     const Test: FC<{ flag: boolean }> = ({ flag }) => {
        //         if (flag) {
        //             return (
        //                 <Suspense>
        //                     <LazyComponent1/>
        //                 </Suspense>
        //             );
        //         }

        //         return (
        //             <Suspense>
        //                 <LazyComponent2/>
        //             </Suspense>
        //         );
        //     };

        //     expect(firstComponentSpy).toBeCalledTimes(0);
        //     expect(secondComponentSpy).toBeCalledTimes(0);

        //     const screen = page.render(<Test flag={true}/>);

        //     const firstComponentLocator = screen.getByText('Component1');
        //     const secondComponentLocator = screen.getByText('Component2');

        //     await vi.waitFor(() => {
        //         expect(firstComponentSpy).toBeCalledTimes(1);
        //         expect(secondComponentSpy).toBeCalledTimes(1);
        //     });

        //     await expect.element(
        //         firstComponentLocator,
        //     ).not.toBeInTheDocument();

        //     await expect.element(
        //         secondComponentLocator,
        //     ).not.toBeInTheDocument();

        //     act(() => {
        //         vi.advanceTimersByTime(SMALL_DELAY);
        //     });

        //     await expect.element(
        //         firstComponentLocator,
        //     ).not.toBeInTheDocument();

        //     await expect.element(
        //         secondComponentLocator,
        //     ).not.toBeInTheDocument();

        //     act(() => {
        //         vi.advanceTimersByTime(BIG_DELAY - SMALL_DELAY);
        //     });

        //     await expect.element(
        //         firstComponentLocator,
        //     ).toBeInTheDocument();

        //     await expect.element(
        //         secondComponentLocator,
        //     ).not.toBeInTheDocument();

        //     screen.rerender(<Test flag={false}/>);

        //     await expect.element(
        //         firstComponentLocator,
        //     ).not.toBeInTheDocument();

        //     await expect.element(
        //         secondComponentLocator,
        //     ).toBeInTheDocument();

        //     expect(firstComponentSpy).toBeCalledTimes(1);
        //     expect(secondComponentSpy).toBeCalledTimes(1);
        // });

        it(`
            should throw error if called component is failed to load
        `, async () => {
            const SMALL_DELAY = 1_000;
            const BIG_DELAY = 3_000;

            const errorSpy = vi.fn();

            const firstComponentSpy = (
                vi.fn()
                    // .mockResolvedValue({
                    //     default: () => <div>Component1</div>,
                    // })
                    .mockRejectedValue(new Error('Fail'))
            );

            const secondComponentSpy = vi.fn(() => Promise.resolve({
                default: () => <div>Component2</div>,
            }));

            const preloadGroup = lazyLoad.createPreloadGroup();

            const LazyComponent1 = lazyLoad.reactLazy(
                preloadGroup.withPreloadGroup(
                    lazyLoad.withDelay(
                        firstComponentSpy,
                        { delay: SMALL_DELAY, isDev: true },
                    ),
                ),
            );

            const LazyComponent2 = lazyLoad.reactLazy(
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
                        <ErrorBoundary.Node onError={errorSpy}>
                            <Suspense>
                                <LazyComponent1/>
                            </Suspense>
                        </ErrorBoundary.Node>
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

            expect(errorSpy).toBeCalledTimes(0);

            act(() => {
                vi.advanceTimersByTime(BIG_DELAY);
            });

            await vi.waitFor(() => {
                console.log(screen.container);
                expect(errorSpy).toBeCalledTimes(1);
            });

            await expect.element(
                firstComponentLocator,
            ).not.toBeInTheDocument();

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

    describe('createPreloadGroup', () => {
        it('should load called component and fetch others', async () => {});

        it('should retry on failure', async () => {});
    });
});