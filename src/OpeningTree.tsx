import React from 'react';
import './OpeningTree.css'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeView from '@material-ui/lab/TreeView';
import {EcoLoader, OpeningNode} from "./EcoLoader";
import {TreeItem} from "@material-ui/lab";

export interface OpeningTreeProps{
    data: OpeningNode[],
    invokerClickCallback: any,
    newCallback: any,
    ecoLoader: EcoLoader
}

interface OpeningTreeState{
    expanded: string[],
    selected: string
}

export class OpeningTree extends React.Component<OpeningTreeProps, OpeningTreeState> {

    componentWillMount() {
        this.setState({expanded: [], selected: ""})
    }

    localClickCallback = (event, value) => {
        var expanded = this.state.expanded
        if(value === this.state.selected){
            const index = expanded.indexOf(value);
            index > -1 ? expanded.splice(index, 1) : expanded.push(value);
        }
        this.setState({selected: value, expanded: expanded})
        this.props.invokerClickCallback(event,value)
        console.log(value)
        console.log(this.props.ecoLoader.idToNodeMap)
        this.props.newCallback(this.props.ecoLoader.idToNodeMap.get(value).moves)
    }

    renderOpeningNode(openingNode: OpeningNode) {
        return <TreeItem key={openingNode.id} nodeId={openingNode.id} label={openingNode.name}>
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
                expanded={this.state.expanded}
                selected = {this.state.selected}
                className="tree"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                onNodeSelect = {this.localClickCallback}
            >
                {this.renderListOfOpeningNodes(this.props.data)}
            </TreeView>
        );
    }
}