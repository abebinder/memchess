import React, {Component, Props} from "react";
import Chessboard from "chessboardjsx";
import {Move} from './Move'
import * as ChessJS from "chess.js"
import {ShortMove, Square} from "chess.js";
import { EcoLoader } from "./EcoLoader";
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;


class HumanVsHuman extends Component {

    movecounter: number;
    variation: Move[];
    game: any;
    ecoLoader: EcoLoader;


    constructor(props: any) {
        super(props);
        this.game = new Chess();
        this.variation = [new Move("e2", "e4", "e7", "e5"), new Move("g1","f3","b8","c6")];
        this.movecounter=0
        this.ecoLoader = new EcoLoader();
        this.ecoLoader.load("")
    }

    state = {
        fen: "start",
        // array of past game moves
        history: []
    };


    onDrop = ({sourceSquare, targetSquare} : {sourceSquare:Square, targetSquare:Square})=> {
        // see if the move is legal
        if(this.movecounter >= this.variation.length) return
        const expectedVariationMove = this.variation[this.movecounter];
        console.log(expectedVariationMove.whiteSourceSquare);
        console.log(sourceSquare)
        var matchVariation = expectedVariationMove.whiteSourceSquare === sourceSquare
            && expectedVariationMove.whiteTargetSquare === targetSquare
        console.log(matchVariation)
        if(!matchVariation) return

        let move = this.game.move({
            from: sourceSquare,
            to: targetSquare,
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

        // @ts-ignore
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