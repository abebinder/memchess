import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import OpeningDriller from "./components/OpeningDriller";
import themes from 'devextreme/ui/themes';

themes.initialized(() => ReactDOM.render(
    <React.StrictMode>
        <OpeningDriller/>
    </React.StrictMode>,
    document.getElementById('root')
));
