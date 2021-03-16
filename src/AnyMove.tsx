import React, {Component, Props} from "react";
import Chessboard from "chessboardjsx";
import * as ChessJS from "chess.js"
import {ShortMove, Square, ChessInstance} from "chess.js";
import { EcoLoader } from "./EcoLoader";
import * as Mover from "./Mover"
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
        if(this.orientation === 'white') return
        const move = Mover.move({
            move: this.variation[this.movecounter],
            game: this.game})
        this.incrementState()
    }

    onDrop = ({sourceSquare, targetSquare} : {sourceSquare:Square, targetSquare:Square})=> {
        const playermove = Mover.move({
            move: this.variation[this.movecounter],
            game: this.game,
            expectedSourceSquare: sourceSquare,
            expectedTargetSquare: targetSquare})
        if (!playermove) return
        this.incrementState()
        const response = Mover.move({
            move: this.variation[this.movecounter],
            game: this.game
        })
        if(!response) return
        this.incrementState();
    };

    incrementState(){
        this.setState({
            fen: this.game.fen(),
            history: this.game.history({verbose: true}),
        });
        this.movecounter++;
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