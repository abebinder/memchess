import React, {Component} from "react";
import Chessground from "react-chessground"
import "react-chessground/dist/styles/chessground.css"
import * as ChessJS from "chess.js"
import {ChessInstance, ShortMove} from "chess.js"
import {EcoLoader, OpeningNode} from "./EcoLoader";
import * as Mover from "./Mover"
import './OpeningDriller.css'
import {OpeningTree} from "./OpeningTree";
import {Button} from "@material-ui/core";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

interface OpeningDrillerState {
    orientation: string,
    initLoading: boolean,
    game: ChessInstance,
    moves: ShortMove[]
}

class OpeningDriller extends Component<{}, OpeningDrillerState> {

    ecoLoader: EcoLoader = new EcoLoader();

    state = {
        orientation: "white",
        initLoading: true,
        game: new Chess(),
        moves: []
    };


    componentDidMount() {
        this.ecoLoader.initialize().then(() => {
            this.setState({initLoading: false}, this.moveForWhite)
            });
    }

    onDrop = (sourceSquare, targetSquare) => {
        const playermove = Mover.move({
            move: this.state.moves[this.state.game.history().length],
            game: this.state.game,
            expectedSourceSquare: sourceSquare,
            expectedTargetSquare: targetSquare
        })
        if (!playermove) {
            this.forceUpdate()
            return
        }
        this.setState({game: this.state.game});
        if (this.resetIfEnd()) {
            this.forceUpdate()
            return
        }
        const response = Mover.move({
            move: this.state.moves[this.state.game.history().length],
            game: this.state.game
        })
        if (!response) {
            this.forceUpdate()
            return;
        }
        this.setState({game: this.state.game}, this.resetIfEnd);
    };

    switchColor = () => {
        var newOrientation = "white";
        if (this.state.orientation === "white") {
            newOrientation = "black"
        }
        this.setState({orientation: newOrientation, game: new Chess()}, this.moveForWhite);
    }

    resetIfEnd() {
        if (this.state.game.history().length < this.state.moves.length) {
            return false;
        }
        setTimeout(() => {
            this.setState({game: new Chess()}, this.moveForWhite);
        }, 1000);
        return true;
    }

    newCallback = (moves) => {
        this.setState({
            moves : moves,
            game: new Chess()
        },
            this.moveForWhite);
    }

    drawArrow(){
        var arrow = []
        if (this.state.game.history().length < this.state.moves.length) {
            arrow = [
                {
                    orig: this.state.moves[this.state.game.history().length].from,
                    dest: this.state.moves[this.state.game.history().length].to,
                    brush: 'green'
                }
            ]
        }
        return arrow;
    }

    render() {
        if (this.state.initLoading) return <h2>Loading...</h2>;
        return (
            <div className='sideBySide'>
                <Chessground
                    fen={this.state.game.fen()}
                    onMove={this.onDrop}
                    orientation={this.state.orientation}
                    drawable={
                        {
                            enabled: false,
                            autoShapes: this.drawArrow()
                        }
                    }
                />
                <OpeningTree
                    newCallback={this.newCallback}
                    ecoLoader={this.ecoLoader}
                />
                <Button onClick={this.switchColor}>Switch Color</Button>
            </div>
        )
    }

    private moveForWhite() {
        if (this.state.orientation === 'black') {
            Mover.move({
                move: this.state.moves[this.state.game.history().length],
                game: this.state.game
            })
            this.setState({game: this.state.game});
        }
    }
}

export default OpeningDriller