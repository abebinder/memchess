import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';

class VirtualizedList extends React.Component {

    renderRow(props) {
        console.log("props of  row is");
        console.log(props)
        const {index, style} = props;
        return (
            <ListItem button style={style} key={index}>
                <ListItemText primary={`Item ${index + 1}`}/>
            </ListItem>
        );
    }

    render() {
        console.log("props is");
        console.log(this.props);
        return (
            <FixedSizeList height={400} width={300} itemSize={46} itemCount={200}>
                {this.renderRow}
            </FixedSizeList>
        )
    }
}

export default  VirtualizedList;
