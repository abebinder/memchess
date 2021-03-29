import React, {Component} from "react";
import Chessboard from "chessboardjsx";
import * as ChessJS from "chess.js"
import {ChessInstance, ShortMove, Square} from "chess.js"
import {EcoLoader, Opening} from "./EcoLoader";
import * as Mover from "./Mover"
import VirtualizedList from './VirtualizedList'
import './OpeningDriller.css'

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

interface OpeningDrillerState{
    loading: boolean,
    activeVariationIndex: number,
    game: ChessInstance
}

class OpeningDriller extends Component<{}, OpeningDrillerState>{

    ecoLoader: EcoLoader = new EcoLoader();
    orientation: "white" | "black" = "black";
    openings: Opening[]

    state = {
        loading: true,
        activeVariationIndex: 0,
        game: new Chess()
    };

    componentDidMount(){
        this.ecoLoader.load().then((data) => {
            this.openings = data
            this.setState({loading: false});
            this.moveForWhite();
        });
    }

    private moveForWhite() {
        if (this.orientation === 'white') return
        Mover.move({
            move: this.openings[this.state.activeVariationIndex].moves[this.state.game.history().length],
            game: this.state.game
        })
        this.setState({game: this.state.game});
    }

    onDrop = ({sourceSquare, targetSquare} : {sourceSquare:Square, targetSquare:Square})=> {
        const playermove = Mover.move({
            move: this.openings[this.state.activeVariationIndex].moves[this.state.game.history().length],
            game: this.state.game,
            expectedSourceSquare: sourceSquare,
            expectedTargetSquare: targetSquare})
        if (!playermove) return
        this.setState({game: this.state.game});
        const response = Mover.move({
            move: this.openings[this.state.activeVariationIndex].moves[this.state.game.history().length],
            game: this.state.game
        })
        if(!response) return
        this.setState({game: this.state.game});
    };

    changeVariation = (index: number) => {
        this.setState({
            activeVariationIndex: index,
            game: new Chess()
        }, this.moveForWhite);
    }

    render() {
        if(this.state.loading) return <h2>Loading...</h2>;
        return (
            <div className='sideBySide'>
            <Chessboard
                id="chessboard"
                position= {this.state.game.fen()}
                onDrop={this.onDrop}
                orientation = {this.orientation}
            />
            <VirtualizedList
             openings={this.openings}
             someCallback={this.changeVariation}/>
            </div>
        )
    }
}

export default OpeningDriller