import {
    StrictMode,
} from 'react';
import {
    createRoot,
    Root,
} from 'react-dom/client';
import {
    BrowserRouter,
} from 'react-router-dom';

import {
    App,
} from './App';

const rootHtmlElement: HTMLElement | null = document.getElementById('root');
if (null === rootHtmlElement) {
    alert('"root" element NOT found in "index.html"!');
} else {
    const reactRootDom: Root = createRoot(rootHtmlElement);

    reactRootDom
        .render(
            <StrictMode basename={process.env.PUBLIC_URL}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </StrictMode>
        );
};