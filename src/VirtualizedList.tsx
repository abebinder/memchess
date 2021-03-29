import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {FixedSizeList} from 'react-window';

interface VirtualizeListProps {
    openings: string[],
    someCallback: any
}

interface VirtualizedListState {
    selectedIndex: number
}

class VirtualizedList extends React.Component<VirtualizeListProps, VirtualizedListState> {

    constructor(props) {
        super(props);
        //Only initialize state like this in constructor. Everywhere else use setstate https://stackoverflow.com/a/35548362
        this.state = {
            selectedIndex: 0,
        }
        this.renderRow = this.renderRow.bind(this);
    }

    handleListItemClick(index) {
        this.setState({
            selectedIndex: index,
        })
        this.props.someCallback(index)
    }

    renderRow(props) {
        const {index, style} = props;
        return (
            <ListItem
                button style={style}
                key={index}
                selected={index === this.state.selectedIndex}
                onClick={() => this.handleListItemClick(index)}
            >
                <ListItemText primary={`${this.props.openings[index]}`}/>
            </ListItem>
        );
    }

    render() {
        return (
            <FixedSizeList height={600}
                           width={300}
                           itemSize={100}
                           itemCount={this.props.openings.length}
                           state={this.state}
            >
                {this.renderRow}
            </FixedSizeList>
        )
    }
}

export default VirtualizedList;
