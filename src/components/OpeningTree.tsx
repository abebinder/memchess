import React from 'react';
import '../css/OpeningTree.css'
import TreeViewComponent from 'devextreme-react/tree-view';
import TreeView from "devextreme/ui/tree_view";
import {EcoLoader} from "../helpers/EcoLoader";
import {ShortMove} from "chess.js";

export interface OpeningTreeProps {
    onClickCallback: (moves: ShortMove[]) => void,
    ecoLoader: EcoLoader
}

export class OpeningTree extends React.Component<OpeningTreeProps> {


    localClickCallback = (e: {component: TreeView}): void => {
        if (e.component.getSelectedNodes().length > 0) {
            this.props.onClickCallback(e.component.getSelectedNodes()[0].itemData.moves)
        }
    }

    render(): JSX.Element {

        return (
            <TreeViewComponent
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