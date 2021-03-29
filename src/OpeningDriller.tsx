import React, {Component} from "react";
import Chessboard from "chessboardjsx";
import * as ChessJS from "chess.js"
import {ChessInstance, ShortMove, Square} from "chess.js"
import {EcoLoader} from "./EcoLoader";
import * as Mover from "./Mover"
import VirtualizedList from './VirtualizedList'
import './OpeningDriller.css'

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

interface OpeningDrillerState{
    loading: boolean,
    variation: ShortMove[],
    game: ChessInstance
}

class OpeningDriller extends Component<{}, OpeningDrillerState>{

    ecoLoader: EcoLoader = new EcoLoader();
    orientation: "white" | "black" = "black";
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
            this.moveForWhite();
        });
    }

    private moveForWhite() {
        if (this.orientation === 'white') return
        Mover.move({
            move: this.state.variation[this.state.game.history().length],
            game: this.state.game
        })
        this.setState({game: this.state.game});
    }

    onDrop = ({sourceSquare, targetSquare} : {sourceSquare:Square, targetSquare:Square})=> {
        const playermove = Mover.move({
            move: this.state.variation[this.state.game.history().length],
            game: this.state.game,
            expectedSourceSquare: sourceSquare,
            expectedTargetSquare: targetSquare})
        if (!playermove) return
        this.setState({game: this.state.game});
        const response = Mover.move({
            move: this.state.variation[this.state.game.history().length],
            game: this.state.game
        })
        if(!response) return
        this.setState({game: this.state.game});
    };

    changeVariation(index: number) {
        this.setState({
            variation: this.variationMap.get((Array.from(this.variationMap.keys()))[index]),
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
            openings={Array.from(this.variationMap.keys())}
             someCallback={this.changeVariation}/>
            </div>
        )
    }
}

export default OpeningDriller