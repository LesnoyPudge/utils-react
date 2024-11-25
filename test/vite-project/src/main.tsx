import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <div>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
            />
                <App />
        </div>
    </React.StrictMode>,
);