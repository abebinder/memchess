import React from 'react';
import '../css/ControlPanel.css'
import {Helmet} from 'react-helmet'
import OpeningDriller from "./OpeningDriller";


export class App extends React.Component {

    render() {

        return (
            <div>
                <Helmet>
                    <title>MemChess: Opening Trainer</title>
                    <meta name="description"
                          content="A tool for learning chess openings by repetition. Inspired by jay's memchess.com"
                    />
                </Helmet>
                <OpeningDriller/>
            </div>
        );
    }
}