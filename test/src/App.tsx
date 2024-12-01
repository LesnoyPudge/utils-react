
import { createContext, FC, useContext } from 'react';
import './App.css';
import { createContextSelectable, useContextProxy } from '../../build';


const QweContext = createContextSelectable<{ some: 'data' }>();

const ZxcContext = createContext<{ some: 'data' }>({ some: 'data' });

const App2 = () => {
    const data = useContextProxy(QweContext);
    const data2 = useContext(QweContext);
    return (
        <div>
            <>
                data:
                {data.some}
            </>
        </div>
    );
};

const App: FC = () => {
    return (
        <QweContext.Provider value={{ some: 'data' }}>
            <App2/>
        </QweContext.Provider>
    );
};

export default App;