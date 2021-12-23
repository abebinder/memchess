import React from 'react';
import '../style-sheets/controlPanel.scss'
import {Helmet} from 'react-helmet'
import OpeningTrainer from "./openingTrainer";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {About} from "./about";
import {NavBar} from "./navBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style-sheets/app.scss'
import 'devextreme/dist/css/dx.light.css';


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
                    <NavBar/>
                    <Switch>
                        <Route exact path="/" component={OpeningTrainer} />
                        <Route exact path="/about" component={About} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}