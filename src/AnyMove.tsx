import React, {Component, Props} from "react";
import Chessboard from "chessboardjsx";
import {Move} from './Move'
import * as ChessJS from "chess.js"
import {ShortMove, Square, ChessInstance} from "chess.js";
import { EcoLoader } from "./EcoLoader";
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;


class HumanVsHuman extends Component {

    movecounter: number;
    game: ChessInstance;
    ecoLoader: EcoLoader;
    variation_Map: Map<string, ShortMove[]>
    variation: ShortMove[];


    constructor() {
        super({});
        this.game = new Chess();
        this.movecounter=0
        this.ecoLoader = new EcoLoader();
        this.variation_Map = this.ecoLoader.load();
        this.variation = this.variation_Map.get("Sicilian Defense: Najdorf Variation") as ShortMove[];
    }

    state = {
        fen: "start",
        // array of past game moves
        history: []
    };


    onDrop = ({sourceSquare, targetSquare} : {sourceSquare:Square, targetSquare:Square})=> {
        this.variation = this.variation_Map.get("Sicilian Defense: Najdorf Variation") as ShortMove[];
        if(!this.playerMove(sourceSquare, targetSquare)) return
        this.makeExpectedVariationMove();
    };

    playerMove(sourceSquare: Square, targetSquare: Square): boolean{
        if(this.movecounter >= this.variation.length) return false;
        var expectedVariationMove = this.variation[this.movecounter];
        var matchVariation = expectedVariationMove.from === sourceSquare
            && expectedVariationMove.to === targetSquare
        if(!matchVariation) return false;
        return this.makeExpectedVariationMove();
    }

    makeExpectedVariationMove(): boolean{
        if(this.movecounter >= this.variation.length) return false;
        var expectedVariationMove = this.variation[this.movecounter];
        let move = this.game.move({
            from: expectedVariationMove.from,
            to: expectedVariationMove.to,
            promotion: "q" // always promote to a queen for example simplicity
        });
        this.setState({
            fen: this.game.fen(),
            history: this.game.history({verbose: true}),
        });
        this.movecounter++;
        return true;
    }

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