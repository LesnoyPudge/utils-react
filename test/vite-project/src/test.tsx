
import { FC, useCallback, useEffect, useId, useRef, useState } from 'react';
import { 
    useDebounce, 
    useDebounced, 
    useSet, 
    useThrottle, 
    useThrottled, 
    useUniqueState,
    useEventListener,
    useFunction,
    useCounter,
    useResizeObserver,
    Id,
    Memo,
    Static,
    Hook,
    useSuperRef,
} from '../../../build';
import { addEventListener } from '@lesnoypudge/utils';


const RerenderLog: FC = () => {
    const c = useRef(0)

    useEffect(() => {
        c.current += 1;
    })

    return (
        <div>
            <div>{c.current} ___ {Math.random()}</div>
        </div>
    )
}

export const Test1: FC = () => {
    const {count, inc} = useCounter()

    const superRef = useSuperRef<HTMLButtonElement>(null);

    const testRef = useRef<HTMLButtonElement>(null)
    const [show, setShow] = useState(true);

    const toggle = () => setShow((prev) => !prev);

    const resizableRef = useResizeObserver((entry) => {
        console.log('resize', entry)
    })

    const buttonRef = useEventListener('click', () => {
        inc()
    })

    useEffect(() => {
        return superRef.effect((value) => {
            console.log('this should appear at first render')
            return addEventListener(value, 'click', () => {
                console.log('ref effect is working!')
            })
        })
    }, [])

    useEffect(() => {
        return superRef.effect((value) => {
            console.log('this should also appear at first render')
            return addEventListener(value, 'click', () => {
                console.log('also working!')
            })
        })
    }, [])

    useEffect(() => {
        console.log('testRef', testRef)
    }, [])

    // useEffect(() => {
    //     console.log('should not appear on every rerender')
    // }, [superRef.merge(
    //     testRef, 
    //     resizableRef, 
    //     buttonRef
    // )])


    return (
        <div>
            <Hook use={() => useId()}>
                {(id) => (
                    <Memo>
                        <span>{id}</span>
                        <RerenderLog/>
                    </Memo>
                )}
            </Hook>

            <div>
                <>count: {count}</>
            </div>

            <button onClick={toggle}>
                <>toggle</>
            </button>

            {
                show ? (
                    <button ref={superRef.merge(
                        testRef, 
                        resizableRef, 
                        buttonRef
                    )} style={{
                        resize: 'both',
                        overflow: 'auto'
                    }}>
                        <>trigger</>
                    </button>
                ) : null
            }
        </div>
    );
};