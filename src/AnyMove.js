import React, { Component } from "react";
import PropTypes from "prop-types";
import * as Chess from "chess.js";
import Chessboard from "chessboardjsx";
import {Move} from './Move'
class HumanVsHuman extends Component {

    static propTypes = { children: PropTypes.func };

    componentDidMount() {
        this.game = new Chess();
        this.variation = [new Move("e2", "e4", "e7", "e5")];
        this.movecounter=0
    }

    state = {
        fen: "start",
        // array of past game moves
        history: []
    };


    onDrop = ({sourceSquare, targetSquare}) => {
        // see if the move is legal
        if(this.movecounter >= this.variation.length) return
        var matchVariation = this.variation[this.movecounter].whiteSourceSquare === sourceSquare
            && this.variation[this.movecounter].whiteTargetSquare === targetSquare;
        console.log(matchVariation)
        if(!matchVariation) return

        let move = this.game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q" // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return;
        this.setState({
            fen: this.game.fen(),
            history: this.game.history({verbose: true}),
        });

        this.movecounter++;

    };

    render() {
        const { fen} = this.state;

        return this.props.children({
            position: fen,
            onDrop: this.onDrop,
        });
    }
}

export default function AnyMove() {
    return (
        <div>
            <HumanVsHuman>
                {({
                      position,
                      onDrop
                  }) => (
                    <Chessboard
                        id="humanVsHuman"
                        position={position}
                        onDrop={onDrop}
                    />
                )}
            </HumanVsHuman>
        </div>
    );
}