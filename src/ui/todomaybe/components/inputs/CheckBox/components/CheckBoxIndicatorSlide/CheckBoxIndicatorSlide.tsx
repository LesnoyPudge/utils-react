import { animated, easings, useSpringValue } from '@react-spring/web';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { useUpdateEffect } from 'usehooks-ts';



interface CheckBoxIndicatorSlide extends PropsWithClassName {
    checked: boolean;
}

const styles = {
    wrapper: {
        base: 'flex shrink-0 w-10 h-6 p-[3px] rounded-full bg-icon-300 transition-all duration-200 ease-linear',
        active: 'bg-positive',
    },
    inner: 'w-full relative',
    ball: 'absolute top-1/2 h-[18px] w-[18px] rounded-full bg-white',
    barsWrapper: 'h-full w-full relative',
    bars: {
        base: 'absolute top-1/2 left-1/2 w-0.5 bg-icon-300',
        active: 'bg-positive',
    },
};

export const CheckBoxIndicatorSlide: FC<CheckBoxIndicatorSlide> = ({
    className = '',
    checked,
}) => {
    const x = useSpringValue(checked ? 1 : 0, {
        config: {
            duration: 200,
            easing: easings.linear,
        },
    });
    
    useUpdateEffect(() => {
        x.start(checked ? 1 : 0);
    }, [checked]);
    
    return (
        <div className={twClassNames(
            styles.wrapper.base,
            { [styles.wrapper.active]: checked }, 
            className,
        )}>
            <div className={styles.inner}>
                <animated.div 
                    className={styles.ball}
                    style={{
                        /*  
                            keyframes
                            0 % { width: 18px; height: 18; translateX: 0px; }
                            30% { width: 24px; height: 16; }
                            70% { width: 24px; height: 16; }
                            100% { width: 18px; height: 18; translateX: 16px; }
                        `*/
                        width: x.to({
                            range: [0, 0.3, 0.7, 1], 
                            output: [18, 24, 24, 18],
                        }).to((value) => `${value}px`),

                        height: x.to({
                            range: [0, 0.3, 0.7, 1], 
                            output: [18, 15, 15, 18],
                        }).to((value) => `${value}px`),                

                        transform: x.to({
                            range: [0, 1],
                            output: [0, 16],
                        }).to((value) => `translateY(-50%) translateX(${value}px)`),
                    }}
                >
                    <div className={styles.barsWrapper}>
                        <animated.div
                            className={twClassNames(
                                styles.bars.base,
                                { [styles.bars.active]: checked },
                            )}
                            style={{
                                /*  
                                    keyframes
                                    0 % { height: 12px; translateX: -1px; translateY: -6px; rotate: 45deg; }
                                    30% { height: 6px; translateY: -3px; rotate: 90deg; }
                                    70% { height: 6px; translateY: -3px; rotate: 90deg; }
                                    100% { height: 5px; translateX: -3px; translateY: 0px; rotate: 120deg; }
                                `*/
                                height: x.to({
                                    range: [0, 0.3, 0.7, 1],
                                    output: [12, 6, 6, 5],
                                }).to((value) => `${value}px`),
                                translateX: x.to({
                                    range: [0, 1],
                                    output: [-1, -3],
                                }).to((value) => `${value}px`),
                                translateY: x.to({
                                    range: [0, 0.3, 0.7, 1],
                                    output: [-6, -3, -3, 0],
                                }).to((value) => `${value}px`),
                                rotate: x.to({
                                    range: [0, 0.3, 0.7, 1],
                                    output: [45, 90, 90, 120],
                                }).to((value) => `${value}deg`),
                            }}
                        ></animated.div>

                        <animated.div
                            className={twClassNames(
                                styles.bars.base,
                                { [styles.bars.active]: checked },
                            )}
                            style={{
                                /*  
                                    keyframes
                                    0 % { height: 12px; translateX: -1px; translateY: -6px; rotate: -45deg; }
                                    30% { height: 6px; translateY: -3px; rotate: -90deg; }
                                    70% { height: 6px; translateY: -3px; rotate: -90deg; }
                                    100% { height: 8px; translateX: 1px; translateY: -3px; rotate: -135deg; }
                                `*/
                                height: x.to({
                                    range: [0, 0.3, 0.7, 1],
                                    output: [12, 6, 6, 8],
                                }).to((value) => `${value}px`),
                                translateX: x.to({
                                    range: [0, 1],
                                    output: [-1, 1],
                                }).to((value) => `${value}px`),
                                translateY: x.to({
                                    range: [0, 0.3, 0.7, 1],
                                    output: [-6, -3, -3, -3],
                                }).to((value) => `${value}px`),
                                rotate: x.to({
                                    range: [0, 0.3, 0.7, 1],
                                    output: [-45, -90, -90, -135],
                                }).to((value) => `${value}deg`),
                            }}
                        ></animated.div>
                    </div>
                </animated.div>
            </div>
        </div>
    );
};