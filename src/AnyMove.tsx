import React, {Component, Props} from "react";
import Chessboard from "chessboardjsx";
import * as ChessJS from "chess.js"
import {ShortMove, Square, ChessInstance} from "chess.js";
import { EcoLoader } from "./EcoLoader";
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;


class HumanVsHuman extends Component {

    movecounter: number;
    game: ChessInstance;
    ecoLoader: EcoLoader;
    variationMap: Map<string, ShortMove[]>
    variation: ShortMove[];
    orientation: string;


    constructor() {
        super({});
        this.game = new Chess();
        this.movecounter=0
        this.ecoLoader = new EcoLoader();
        //placehoder
        this.variationMap = new Map<string, []>()
        //placeholder
        this.variation = [];
        this.orientation="white";
    }

    state = {
        fen: "start",
        // array of past game moves
        history: []
    };

    async componentDidMount(){
        this.variationMap = await this.ecoLoader.load();
        this.variation = this.variationMap.get("Sicilian Defense: Najdorf Variation") as ShortMove[];
        if(this.orientation === 'black') this.makeExpectedVariationMove()
    }

    onDrop = ({sourceSquare, targetSquare} : {sourceSquare:Square, targetSquare:Square})=> {
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
            orientation: this.orientation
        });
    }
}

export default function AnyMove() {
    return (
        <div>
            <HumanVsHuman>
                {({
                      position,
                      onDrop,
                      orientation
                  }: {position: any, onDrop: any, orientation: any}) => (
                    <Chessboard
                        id="humanVsHuman"
                        position={position}
                        onDrop={onDrop}
                        orientation = {orientation}
                    />
                )}
            </HumanVsHuman>
        </div>
    );
}