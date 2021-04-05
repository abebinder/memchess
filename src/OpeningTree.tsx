import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {FixedSizeList} from 'react-window';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeView from '@material-ui/lab/TreeView';
import {OpeningNode} from "./EcoLoader";
import {TreeItem} from "@material-ui/lab";

export interface OpeningTreeProps{
    data: OpeningNode[]
}
export class OpeningTree extends React.Component<OpeningTreeProps> {

     itemSelect(event, value){
         console.log(value)
     }

    renderOpeningNode(openingNode: OpeningNode) {
        return <TreeItem key={openingNode.name} nodeId={openingNode.name} label={openingNode.name}>
            {Array.isArray(openingNode.children) ? openingNode.children.map((node) => this.renderOpeningNode(node)) : null}
        </TreeItem>
    }

    renderListOfOpeningNodes(someNodes: OpeningNode[]) {
        return someNodes.map((node, index) => {
            return this.renderOpeningNode(node)
        })
    }


    render() {

        return (
            <TreeView
                className="treeClasas"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                onNodeSelect = {this.itemSelect}
            >
                {this.renderListOfOpeningNodes(this.props.data)}
            </TreeView>
        );
    }
}