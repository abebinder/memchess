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


    render() {


        const renderTree = (nodes: OpeningNode) => (
            <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
                {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
            </TreeItem>
        );

        const renderTreeNodes = (someNodes: OpeningNode[]) => {
            return someNodes.map((nodes, index) => {
                return <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
                    {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
                </TreeItem>
            })
        }

        return (
            <TreeView
                className="treeClasas"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpanded={['root']}
                defaultExpandIcon={<ChevronRightIcon />}
                onNodeSelect = {this.itemSelect}
            >
                {renderTreeNodes(this.props.data)}
            </TreeView>
        );
    }
}