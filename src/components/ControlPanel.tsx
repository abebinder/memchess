import React from 'react';
import {Button} from "@material-ui/core";
import '../css/ControlPanel.css'

export interface ControlPanelProps {
    switchColorsCallback: any,
    toggleArrowsCallback: any
}

export class ControlPanel extends React.Component<ControlPanelProps> {

    render() {

        return (
            <div className={"controlPanel"}>
                <Button className={"button"} onClick={this.props.switchColorsCallback}>Switch Color</Button>
                <Button className={"button"} onClick={this.props.toggleArrowsCallback}>Toggle Arrows</Button>
            </div>
        );
    }
}