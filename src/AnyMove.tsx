import React, {Component, Props} from "react";
import Chessboard from "chessboardjsx";
import {Move} from './Move'
import * as ChessJS from "chess.js"
import {ShortMove, Square} from "chess.js";
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;


interface AnyMoveProps {
    children: React.ReactNode
}

class HumanVsHuman extends Component {

    movecounter: number;
    variation: Move[];
    game: any;


    constructor(props: AnyMoveProps) {
        super(props);
        this.game = new Chess();
        this.variation = [new Move("e2", "e4", "e7", "e5")];
        this.movecounter=0
    }

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


    onDrop = (movement: ShortMove) => {
        // see if the move is legal
        if(this.movecounter >= this.variation.length) return
        const expectedVariationMove = this.variation[this.movecounter];
        var matchVariation = expectedVariationMove.whiteSourceSquare === movement.from
            && expectedVariationMove.whiteTargetSquare === movement.to;
        console.log(matchVariation)
        if(!matchVariation) return

        let move = this.game.move({
            from: movement.from,
            to: movement.to,
            promotion: "q" // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return;

        let response = this.game.move({
            from: expectedVariationMove.blackSourceSquare,
            to: expectedVariationMove.blackTargetSquare,
            promotion: "q" // always promote to a queen for example simplicity
        });

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
                  }: {position: any, onDrop: any}) => (
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