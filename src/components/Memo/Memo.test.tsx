import { page } from '@vitest/browser/context';
import { Memo } from './Memo';
import { FC, PropsWithChildren } from 'react';


describe('Memo', () => {
    it('should work as React.memo with deep comparison', () => {
        const renderSpy = vi.fn();

        const Inner: FC<(
            PropsWithChildren
            & { deep: { value: number } }
        )> = ({ deep, children }) => {
            renderSpy();

            return (
                <div>
                    {deep.value}

                    {children}
                </div>
            );
        };

        const screen = page.render((
            <Memo>
                <Inner deep={{ value: 1 }}>
                    <>1</>
                </Inner>
            </Memo>
        ));

        expect(renderSpy).toBeCalledTimes(1);

        screen.rerender((
            <Memo>
                <Inner deep={{ value: 1 }}>
                    <>1</>
                </Inner>
            </Memo>
        ));

        expect(renderSpy).toBeCalledTimes(1);

        screen.rerender((
            <Memo>
                <Inner deep={{ value: 2 }}>
                    <>1</>
                </Inner>
            </Memo>
        ));

        expect(renderSpy).toBeCalledTimes(2);

        screen.rerender((
            <Memo>
                <Inner deep={{ value: 2 }}>
                    <>2</>
                </Inner>
            </Memo>
        ));

        expect(renderSpy).toBeCalledTimes(3);
    });
});