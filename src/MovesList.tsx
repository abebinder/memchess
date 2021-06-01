import React from 'react';
import {ShortMove} from "chess.js";
import './MovesList.css'

interface MovesListProps {
    moves: ShortMove[],
    activeMove: number
}

export class MovesList extends React.Component<MovesListProps> {
    render() {
        const listItems = this.props.moves.map((move, index) => {
            var suffix = index == this.props.activeMove ? "  <---------" : "";
            return <li>{move.from + " to  " + move.to + suffix}</li>;
        })
        return (
            <div className='moveslist'>
                <ul>
                    {listItems}
                </ul>
            </div>
        );

    }
}