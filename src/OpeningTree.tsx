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

     data = {
        id: 'root',
        name: 'Parent',
        children: [
            {
                id: '1',
                name: 'Child - 1',
            },
            {
                id: '3',
                name: 'Child - 3',
                children: [
                    {
                        id: '4',
                        name: 'Child - 4',
                    },
                ],
            },
        ],
    };

     itemSelect(event, value){
         console.log(value)
     }


    render() {

        const renderTree = (nodes: OpeningNode) => (
            <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
                {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
            </TreeItem>
        );

        return (
            <TreeView
                className="treeClasas"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpanded={['root']}
                defaultExpandIcon={<ChevronRightIcon />}
                onNodeSelect = {this.itemSelect}
            >
                {renderTree(this.props.data[18])}
            </TreeView>
        );
    }
}