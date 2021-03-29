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

    ecoLoader: EcoLoader = new EcoLoader();
    orientation: "white" | "black" = "white";
    variationMap: Map<string, ShortMove[]>

    state = {
        loading: true,
        variation: [],
        game: new Chess()
    };

    componentDidMount(){
        this.ecoLoader.load().then((data) => {
            this.variationMap = data
            this.setState({
                loading: false,
                variation: data.get("Alekhine Defense") as ShortMove[]
            });
            if(this.orientation === 'white') return
            Mover.move({
                move: this.state.variation[this.state.game.history().length],
                game: this.state.game})
            this.updateState()
        });
    }

    onDrop = ({sourceSquare, targetSquare} : {sourceSquare:Square, targetSquare:Square})=> {
        const playermove = Mover.move({
            move: this.state.variation[this.state.game.history().length],
            game: this.state.game,
            expectedSourceSquare: sourceSquare,
            expectedTargetSquare: targetSquare})
        if (!playermove) return
        this.updateState()
        const response = Mover.move({
            move: this.state.variation[this.state.game.history().length],
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
                move: this.state.variation[this.state.game.history().length],
                game: this.state.game})
            this.updateState()
        });
    }

    updateState(){
        this.setState({
            game: this.state.game,
        });
    }


    render() {

        if(this.state.loading) return <h2>Loading...</h2>;
        return (
            <div className='sideBySide'>
            <Chessboard
                id="humanVsHuman"
                position= {this.state.game.fen()}
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