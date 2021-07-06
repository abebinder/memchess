import React from 'react';
import '../style-sheets/ControlPanel.scss'
import {Helmet} from 'react-helmet'

export class About extends React.Component {

    render(): JSX.Element {

        return (
                <div>
                    <Helmet>
                        <title>MemChess: About</title>
                    </Helmet>
                    <h2> About </h2>
                    <p> This is an application for learning openings by repetition.
                        The source code for the application can be found at <a href={"https://github.com/abebinder/memchess"}>https://github.com/abebinder/memchess</a> <br/>
                        This application is based off the original memchess.com, written by <a href={"https://www.reddit.com/user/Jay-_/"}>jay</a>.
                        Unfortunately memchess.com went dark in 2019. Jay if you are out there, give us a sign!
                    </p>
                </div>
        );
    }
}