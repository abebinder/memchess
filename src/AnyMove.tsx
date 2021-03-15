import React, {Component, Props} from "react";
import Chessboard from "chessboardjsx";
import {Move} from './Move'
import * as ChessJS from "chess.js"
import {ShortMove, Square} from "chess.js";
import { EcoLoader } from "./EcoLoader";
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;


class HumanVsHuman extends Component {

    movecounter: number;
    variation: any;
    game: any;
    ecoLoader: EcoLoader;
    variation_Map: any


    constructor(props: any) {
        super(props);
        this.game = new Chess();
        this.movecounter=0
        this.ecoLoader = new EcoLoader();
        this.variation_Map = this.ecoLoader.load();
        console.log("Variation map is")
        console.log(this.variation_Map)
        console.log("keys")
        console.log(this.variation_Map.keys())
        console.log("variation map get");
        console.log(this.variation_Map.get("Amar Gambit"))
        this.variation = this.variation_Map.get("Amar Gambit");
        console.log("Variation is")
        console.log(this.variation)
    }

    state = {
        fen: "start",
        // array of past game moves
        history: []
    };


    onDrop = ({sourceSquare, targetSquare} : {sourceSquare:Square, targetSquare:Square})=> {
        this.variation = this.variation_Map.get("Amar Gambit");
        // see if the move is legal
        console.log("Variation is (ondrop)")
        console.log(this.variation)
        if(this.movecounter >= this.variation.length) return
        var expectedVariationMove = this.variation[this.movecounter];
        console.log(expectedVariationMove.from);
        console.log(sourceSquare)
        var matchVariation = expectedVariationMove.from === sourceSquare
            && expectedVariationMove.to === targetSquare
        console.log(matchVariation)
        if(!matchVariation) return

        let move = this.game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q" // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return;

        this.movecounter++;
        if(this.movecounter >= this.variation.length) return;
        expectedVariationMove = this.variation[this.movecounter];


        let response = this.game.move({
            from: expectedVariationMove.from,
            to: expectedVariationMove.to,
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