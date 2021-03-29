import React, {Component, Props} from "react";
import Chessboard from "chessboardjsx";
import * as ChessJS from "chess.js"
import {ShortMove, Square, ChessInstance} from "chess.js";
import { EcoLoader } from "./EcoLoader";
import * as Mover from "./Mover"
import  VirtualizedList from './VirtualizedList'
import './OpeningDriller.css'
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

class OpeningDriller extends Component{

    game: ChessInstance = new Chess();
    ecoLoader: EcoLoader = new EcoLoader();
    orientation: "white" | "black" = "black";
    variationMap: Map<string, ShortMove[]>
    variation: ShortMove[];

    state = {
        fen: "start",
        history: [],
        loading: true,
        selectedIndex: 0,
        variation: [],
        game: new Chess()
    };

    resetState(){
        this.setState({
            fen: "start",
            history: [],
            game: new Chess() 
        })
    }

    componentDidMount(){
        this.ecoLoader.load().then((data) => {
            this.variationMap = data
            this.variation = data.get("Sicilian Defense: Najdorf Variation") as ShortMove[];
            this.setState({
                loading: false,
                variation: this.variation
            });
            if(this.orientation === 'white') return
            Mover.move({
                move: this.state.variation[this.state.history.length],
                game: this.state.game})
            this.updateState()
        });
    }

    onDrop = ({sourceSquare, targetSquare} : {sourceSquare:Square, targetSquare:Square})=> {
        const playermove = Mover.move({
            move: this.state.variation[this.state.history.length],
            game: this.state.game,
            expectedSourceSquare: sourceSquare,
            expectedTargetSquare: targetSquare})
        if (!playermove) return
        this.updateState()
        const response = Mover.move({
            move: this.state.variation[this.state.history.length],
            game: this.state.game
        })
        if(!response) return
        this.updateState();
    };

    someCallback = (index: number) => {
        const openings=Array.from(this.variationMap.keys())
        console.log("parent  informed of")
        console.log(this.variationMap.get(openings[index]))
        this.setState({
            variation: this.variationMap.get(openings[index]),
            fen: "start",
            history: [],
            game: new Chess()
        }, () => {
            if(this.orientation === 'white') return
            console.log("black logging state")
            console.log(this.state)
            Mover.move({
                move: this.state.variation[this.state.history.length],
                game: this.state.game})
            this.updateState()
        });
    }

    updateState(){
        this.setState({
            fen: this.state.game.fen(),
            history: this.state.game.history({verbose: true}),
            loading: false,
            selectedIndex: 0
        });
    }


    render() {

        if(this.state.loading) return <h2>Loading...</h2>;
        return (
            <div className='sideBySide'>
            <Chessboard
                id="humanVsHuman"
                position= {this.state.fen}
                onDrop={this.onDrop}
                orientation = {this.orientation}
            />
            <VirtualizedList
            openings={Array.from(this.variationMap.keys())}
             someCallback={this.someCallback}/>
            </div>
        )
    }
}

export default OpeningDriller