import React, {Component} from "react";
import Chessground from "react-chessground"
import "react-chessground/dist/styles/chessground.css"
import * as ChessJS from "chess.js"
import {ChessInstance, ShortMove} from "chess.js"
import {EcoLoader} from "../helpers/EcoLoader";
import * as Mover from "../helpers/Mover"
import '../css/OpeningDriller.css'
import {OpeningTree} from "./OpeningTree";
import {drawArrow} from "../helpers/Drawer";
import {ControlPanel} from "./ControlPanel";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

export interface OpeningDrillerState {
    orientation: string,
    loading: boolean,
    game: ChessInstance,
    moves: ShortMove[],
    shouldDraw: boolean
}

export class OpeningDriller extends Component<{}, OpeningDrillerState> {

    ecoLoader: EcoLoader = new EcoLoader();

    state = {
        orientation: "white",
        loading: true,
        game: new Chess(),
        moves: [],
        shouldDraw: true
    };


    componentDidMount() {
        this.ecoLoader.initialize().then(() => {
            this.setState({loading: false, moves: this.ecoLoader.rootNodes[0].moves},
                () => this.computerMove(true))
        });
    }

    onDrop = (sourceSquare, targetSquare) => {
        const playermove = Mover.move({
            move: this.state.moves[this.state.game.history().length],
            game: this.state.game,
            callback: (game) => {this.setState({game: game});},
            expectedSourceSquare: sourceSquare,
            expectedTargetSquare: targetSquare
        })
        if (!playermove || this.resetIfEnd()) { return }
        this.computerMove(false)
    };

    computerMove(firstmove: boolean){
        //needed to draw first arrow when switching from black to white
        if(firstmove) { this.forceUpdate() }

        if(!firstmove || this.state.orientation === "black") {
            Mover.move({
                move: this.state.moves[this.state.game.history().length],
                game: this.state.game,
                callback: (game) => {this.setState({game: game})}
            })
        }
        if(!firstmove) { this.resetIfEnd() }
    }

    switchColor = () => {
        var newOrientation = "white";
        if (this.state.orientation === "white") {
            newOrientation = "black"
        }
        this.setState({orientation: newOrientation, game: new Chess()}, () => this.computerMove(true));
    }

    resetIfEnd() {
        if (this.state.game.history().length < this.state.moves.length) {
            return false;
        }
        setTimeout(() => {
            this.setState({game: new Chess()}, () => this.computerMove(true));
        }, 1000);
        return true;
    }

    changeMoves = (moves) => {
        this.setState({
            moves : moves,
            game: new Chess()
        }, () => this.computerMove(true));
    }


    render() {
        if (this.state.loading) return <h2>Loading...</h2>;
        return (
            <div className='sideBySide'>
                <Chessground
                    fen={this.state.game.fen()}
                    onMove={this.onDrop}
                    orientation={this.state.orientation}
                    drawable={ drawArrow(this.state) }
                />
                <OpeningTree
                    onClickCallback={this.changeMoves}
                    ecoLoader={this.ecoLoader}
                />
                <ControlPanel
                    switchColorsCallback={this.switchColor}
                    toggleArrowsCallback={() => this.setState({shouldDraw: !this.state.shouldDraw})}
                />
            </div>
        )
    }
}

export default OpeningDriller