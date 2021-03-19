import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';

class VirtualizedList extends React.Component<{openings: string[]}> {

    openings: string[] = [];

    constructor (props){
        super(props);
        this.renderRow = this.renderRow.bind(this);
    }

    renderRow(props) {
        const {index, style} = props;
        return (
            <ListItem button style={style} key={index}>
                <ListItemText primary={`${this.openings[index]}`}/>
            </ListItem>
        );
    }

    render() {
        if(this.openings.length === 0)  this.openings = this.props.openings
        return (
            <FixedSizeList height={600} width={300} itemSize={100} itemCount={this.openings.length}>
                {this.renderRow}
            </FixedSizeList>
        )
    }
}

export default  VirtualizedList;
