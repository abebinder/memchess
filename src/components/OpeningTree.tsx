import React from 'react';
import '../css/OpeningTree.css'
import TreeView from 'devextreme-react/tree-view';
import {EcoLoader} from "../helpers/EcoLoader";

export interface OpeningTreeProps {
    onClickCallback: any,
    ecoLoader: EcoLoader
}

export class OpeningTree extends React.Component<OpeningTreeProps> {


    localClickCallback = (e) => {
        if (e.component.getSelectedNodes().length > 0) {
            this.props.onClickCallback(e.component.getSelectedNodes()[0].itemData.moves)
        }
    }

    render() {

        return (
            <TreeView
                className={"tree"}
                id="treeview"
                items={this.props.ecoLoader.rootNodes}
                onSelectionChanged={this.localClickCallback}
                selectByClick={true}
                selectionMode='single'
                searchEnabled={true}
                searchTimeout={1000}
            />
        );
    }
}