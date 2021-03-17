import React, {Component, Props} from "react";
import Chessboard from "chessboardjsx";
import * as ChessJS from "chess.js"
import {ShortMove, Square, ChessInstance} from "chess.js";
import { EcoLoader } from "./EcoLoader";
import * as Mover from "./Mover"
import  VirtualizedList from './VirtualizedList'
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

class OpeningDriller extends Component{

    game: ChessInstance = new Chess();
    ecoLoader: EcoLoader = new EcoLoader();
    orientation: "white" | "black" = "white";
    variationMap: Map<string, ShortMove[]>
    variation: ShortMove[];

    state = {
        fen: "start",
        history: [],
        loading: true
    };

    componentDidMount(){
        this.ecoLoader.load().then((data) => {
            this.variationMap = data
            this.variation = data.get("Sicilian Defense: Najdorf Variation") as ShortMove[];
            this.setState({
                fen: "start",
                history: [],
                loading: false
            });
            if(this.orientation === 'white') return
            Mover.move({
                move: this.variation[this.state.history.length],
                game: this.game})
            this.updateState()
        });
    }

    onDrop = ({sourceSquare, targetSquare} : {sourceSquare:Square, targetSquare:Square})=> {
        const playermove = Mover.move({
            move: this.variation[this.state.history.length],
            game: this.game,
            expectedSourceSquare: sourceSquare,
            expectedTargetSquare: targetSquare})
        if (!playermove) return
        this.updateState()
        const response = Mover.move({
            move: this.variation[this.state.history.length],
            game: this.game
        })
        if(!response) return
        this.updateState();
    };

    updateState(){
        this.setState({
            fen: this.game.fen(),
            history: this.game.history({verbose: true}),
            loading: false
        });
    }

    render() {

        if(this.state.loading) return <h2>Loading...</h2>;
        return (
            <div>
            <Chessboard
                id="humanVsHuman"
                position= {this.state.fen}
                onDrop={this.onDrop}
                orientation = {this.orientation}
            />
            <VirtualizedList
            listy={Array.from(this.variationMap.keys())}
            />
            </div>
        )
    }
}

export default OpeningDriller