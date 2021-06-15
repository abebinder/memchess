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
    treeLoading: boolean,
    initLoading: boolean
    game: ChessInstance
    activeId: string
    activeMoves: ShortMove[]
}

class OpeningDriller extends Component<{}, OpeningDrillerState> {

    ecoLoader: EcoLoader = new EcoLoader();
    openingNodes: OpeningNode[]
    openingNodesIdMap: Map<string, OpeningNode>

    state = {
        orientation: "white",
        treeLoading: true,
        initLoading: true,
        game: new Chess(),
        activeId: "",
        activeMoves: []
    };


    componentDidMount() {
        this.ecoLoader.loadMap().then((openings) => {
            this.openingNodes = openings.rootNodes
            this.openingNodesIdMap = openings.idToNodeMap
            this.setState({activeId: Array.from(this.openingNodesIdMap.keys())[0], treeLoading: false},
                this.moveForWhite)
        })
        this.ecoLoader.initialize().then(() => {
                this.setState({initLoading: false})
            }
        );
    }

    onDrop = (sourceSquare, targetSquare) => {
        const playermove = Mover.move({
            move: this.openingNodesIdMap.get(this.state.activeId).moves[this.state.game.history().length],
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
            move: this.openingNodesIdMap.get(this.state.activeId).moves[this.state.game.history().length],
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
        if (this.state.game.history().length < this.openingNodesIdMap.get(this.state.activeId).moves.length) {
            return false;
        }
        setTimeout(() => {
            this.setState({game: new Chess()}, this.moveForWhite);
        }, 1000);
        return true;
    }

    treeCallback = (event, value) => {
        this.setState({
            activeId: value,
            game: new Chess()
        }, this.moveForWhite);
    }

    newCallback = (moves) => {
        this.setState({activeMoves : moves}, this.moveForWhite);
    }

    render() {
        console.log(this.state.activeMoves)
        if (this.state.treeLoading || this.state.initLoading) return <h2>Loading...</h2>;
        var arrow = []
        if (this.state.game.history().length < this.openingNodesIdMap.get(this.state.activeId).moves.length) {
            arrow = [
                {
                    orig: this.openingNodesIdMap.get(this.state.activeId).moves[this.state.game.history().length].from,
                    dest: this.openingNodesIdMap.get(this.state.activeId).moves[this.state.game.history().length].to,
                    brush: 'green'
                }
            ]
        }
        return (
            <div className='sideBySide'>
                <Chessground
                    fen={this.state.game.fen()}
                    onMove={this.onDrop}
                    orientation={this.state.orientation}
                    drawable={
                        {
                            enabled: false,
                            autoShapes: arrow
                        }
                    }
                />
                <OpeningTree
                    data={this.openingNodes}
                    invokerClickCallback={this.treeCallback}
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
                move: this.openingNodesIdMap.get(this.state.activeId).moves[this.state.game.history().length],
                game: this.state.game
            })
            this.setState({game: this.state.game});
        }
    }
}

export default OpeningDriller