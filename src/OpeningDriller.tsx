import React, {Component} from "react";
import Chessboard from "chessboardjsx";
import * as ChessJS from "chess.js"
import {ChessInstance, ShortMove, Square} from "chess.js"
import {EcoLoader, Opening} from "./EcoLoader";
import * as Mover from "./Mover"
import VirtualizedOpeningList from './VirtualizedOpeningList'
import './OpeningDriller.css'
import {MovesList} from "./MovesList";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

interface OpeningDrillerState {
    loading: boolean,
    activeVariationIndex: number,
    game: ChessInstance
}

class OpeningDriller extends Component<{}, OpeningDrillerState> {

    ecoLoader: EcoLoader = new EcoLoader();
    orientation: "white" | "black" = "white";
    openings: Opening[]

    state = {
        loading: true,
        activeVariationIndex: 0,
        game: new Chess()
    };

    componentDidMount() {
        this.ecoLoader.load().then((openings) => {
            this.openings = openings
            this.setState({loading: false});
            this.moveForWhite();
        });
    }

    onDrop = ({sourceSquare, targetSquare}: { sourceSquare: Square, targetSquare: Square }) => {
        const playermove = Mover.move({
            move: this.openings[this.state.activeVariationIndex].moves[this.state.game.history().length],
            game: this.state.game,
            expectedSourceSquare: sourceSquare,
            expectedTargetSquare: targetSquare
        })
        if (!playermove) return
        this.setState({game: this.state.game});
        if(this.resetIfEnd()) return
        const response = Mover.move({
            move: this.openings[this.state.activeVariationIndex].moves[this.state.game.history().length],
            game: this.state.game
        })
        if (!response) return
        this.setState({game: this.state.game});
        this.resetIfEnd()
    };

    resetIfEnd(){
        if (this.state.game.history().length < this.openings[this.state.activeVariationIndex].moves.length) {
            return false;
        }
        var millisecondsToWait = 1000;
        setTimeout(() => {
            this.setState({game: new Chess()});
            this.moveForWhite()
        }, millisecondsToWait);
        return true;
    }

    changeVariation = (index: number) => {
        this.setState({
            activeVariationIndex: index,
            game: new Chess()
        }, this.moveForWhite);
    }

    render() {
        if (this.state.loading) return <h2>Loading...</h2>;
        return (
            <div className='sideBySide'>
                <Chessboard
                    id="chessboard"
                    position={this.state.game.fen()}
                    onDrop={this.onDrop}
                    orientation={this.orientation}
                />
                <VirtualizedOpeningList
                    openings={this.openings}
                    onClickCallback={this.changeVariation}
                />
                <MovesList
                 moves={this.openings[this.state.activeVariationIndex].moves}
                 activeMove={this.state.game.history().length}
                />
            </div>
        )
    }

    private moveForWhite() {
        if (this.orientation === 'white') return
        Mover.move({
            move: this.openings[this.state.activeVariationIndex].moves[this.state.game.history().length],
            game: this.state.game
        })
        this.setState({game: this.state.game});
    }
}

export default OpeningDriller