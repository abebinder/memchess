import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import OpeningDriller from "./components/OpeningDriller";
import themes from 'devextreme/ui/themes';
import {App} from "./components/App";

themes.initialized(() => ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
));
