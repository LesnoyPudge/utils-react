import { Test1 } from './test';
import * as React from "react";
import { 
    FocusRing, 
    FocusRingScope,
    FocusRingManager,
} from "react-focus-rings";
import "react-focus-rings/src/styles.css";


function Button() {
    return (
        <FocusRing offset={-2}>
            <button
                style={{display: 'block'}}
                onClick={() => FocusRingManager.setRingsEnabled(true)}
            >
                <>Click Me</>
            </button>
        </FocusRing>
    );
}

const Scrollable: React.FC<React.PropsWithChildren> = ({
    children
}) => {
    const ref = React.useRef<HTMLElement>(null)
    return (
        <div ref={ref} style={{
            position: 'relative',
            overflowY: 'scroll',
            height: '150px'
        }}>
            <div style={{
                position: 'absolute',
                width: '100%',
            }}>
                <FocusRingScope containerRef={ref}>
                    {children}
                </FocusRingScope>
            </div>
        </div>
    )
}

const Counter: React.FC<{initial: number}> = ({initial}) => {
    const [count, setCount] = React.useState(initial);

    const inc = () => setCount((prev) => prev + 1);

    return (
        <div>
            <div>count2: {count}</div>

            <button onClick={inc}>inc2</button>
        </div>
    )
}

function App() {
    const [count, setCount] = React.useState(0);

    const inc = () => setCount((prev) => prev + 1);

    return (
        <div>
            <div>count: {count}</div>

            <button onClick={inc}>inc</button>

            <Counter initial={count}/>
        </div>
    )

    // const containerRef = React.useRef<HTMLDivElement>(null);
    // return (
    //   <div 
    //     className="app-container" 
    //     style={{position: 'relative'}} 
    //     ref={containerRef}
    //   >
    //     <link
    //         rel="stylesheet"
    //         href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
    //     />

    //     <FocusRingScope containerRef={containerRef}>
    //       <div className="content">
    //         <p>Here's a paragraph with some text.</p>
            
    //         <FocusRing offset={-2} >
    //           <Button/>
    //         </FocusRing>

    //         <FocusRing offset={-2}>
    //             <Button/>
    //         </FocusRing>

    //         <p>Here's another paragraph with more text.</p>
    //       </div>

    //       <div>
    //         <Scrollable>
    //             <Button/>
    //             <Button/>
    //             <Button/>
    //             <Button/>
    //             <Button/>
    //         </Scrollable>
    //       </div>
    //     </FocusRingScope>
    //   </div>
    // );
}

export default App;