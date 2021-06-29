import React from 'react';
import {Button} from "@material-ui/core";
import '../css/ControlPanel.css'

export interface ControlPanelProps {
    switchColorsCallback: () => void,
    toggleArrowsCallback: () => void
}

export class ControlPanel extends React.Component<ControlPanelProps> {

    render(): JSX.Element {

        return (
            <div className={"controlPanel"}>
                <Button className={"button"} onClick={this.props.switchColorsCallback}>Switch Color</Button>
                <Button className={"button"} onClick={this.props.toggleArrowsCallback}>Toggle Arrows</Button>
            </div>
        );
    }
}