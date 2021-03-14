import React, { Component } from "react";
import PropTypes from "prop-types";
import * as Chess from "chess.js";
import Chessboard from "chessboardjsx";

class HumanVsHuman extends Component {

    static propTypes = { children: PropTypes.func };

    componentDidMount() {
        this.game = new Chess();
        this.variation = [{sourceSquare: "e2", targetSquare: "e4"}];
        this.movecounter=0
    }

    state = {
        fen: "start",
        // array of past game moves
        history: []
    };


    onDrop = ({sourceSquare, targetSquare}) => {
        // see if the move is legal

        var matchVariation = this.variation[this.movecounter].sourceSquare === sourceSquare
            && this.variation[this.movecounter].targetSquare === targetSquare;
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