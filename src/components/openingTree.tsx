import React from 'react';
import '../style-sheets/openingTree.scss'
import TreeViewComponent from 'devextreme-react/tree-view';
import TreeView from "devextreme/ui/tree_view";
import {ShortMove} from "chess.js";
import {Opening} from "../data/opening";

export interface OpeningTreeProps {
    onClickCallback: (moves: ShortMove[]) => void,
    openings: Opening[]
}

export class OpeningTree extends React.Component<OpeningTreeProps> {


    localClickCallback = (e: { component: TreeView }): void => {
        if (e.component.getSelectedNodes().length > 0) {
            this.props.onClickCallback(e.component.getSelectedNodes()[0].itemData.moves)
        }
    }

    render(): JSX.Element {

        return (
            <TreeViewComponent
                className={"tree"}
                id="treeview"
                items={this.props.openings}
                onSelectionChanged={this.localClickCallback}
                selectByClick={true}
                selectionMode='single'
                searchEnabled={true}
                searchTimeout={1000}
            />
        );
    }
}