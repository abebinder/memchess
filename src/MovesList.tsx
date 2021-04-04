import React from 'react';
import {ShortMove} from "chess.js";

interface VirtualizeListProps {
    moves: ShortMove[],
    activeMove: number
}

export class MovesList extends React.Component<VirtualizeListProps> {
    render() {
        const listItems = this.props.moves.map((move, index) => {
            var suffix = index == this.props.activeMove ? "  <---------" : "";
            return <li>{move.from + " to  " + move.to + suffix}</li>;
        })
        return (<ul>{listItems}</ul>);
    }
}