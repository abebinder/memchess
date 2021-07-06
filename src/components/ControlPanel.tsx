import React from 'react';
import {Button} from 'react-bootstrap';
import '../style-sheets/ControlPanel.scss'

export interface ControlPanelProps {
    switchColorsCallback: () => void,
    toggleArrowsCallback: () => void
}

export class ControlPanel extends React.Component<ControlPanelProps> {

    render(): JSX.Element {

        return (
            <div className={"controlPanel"}>
                <Button className={"topButton"} variant={"primary"} onClick={this.props.switchColorsCallback}>Switch Color</Button>
                <Button className={"bottomButton"} variant={"secondary"} onClick={this.props.toggleArrowsCallback}>Toggle Arrows</Button>
            </div>
        );
    }
}