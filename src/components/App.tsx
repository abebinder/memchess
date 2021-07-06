import React from 'react';
import '../style-sheets/ControlPanel.scss'
import {Helmet} from 'react-helmet'
import OpeningDriller from "./OpeningDriller";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {About} from "./About";
import {Header} from "./Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style-sheets/App.scss'


export class App extends React.Component {

    render(): JSX.Element {

        return (
            <div className={"App"}>
                <BrowserRouter>
                    <Helmet>
                        <title>MemChess: Opening Trainer</title>
                        <meta
                            name="description"
                            content="Memchess is a tool for learning chess openings by repetition.
                            Based on jay's memchess.com which disappeared in 2019."
                        />
                    </Helmet>
                    <Header/>
                    <Switch>
                        <Route exact path="/" component={OpeningDriller} />
                        <Route exact path="/about" component={About} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}