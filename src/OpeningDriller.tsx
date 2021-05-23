import React, {Component} from "react";
import Chessboard from "chessboardjsx";
import * as ChessJS from "chess.js"
import {ChessInstance, Square} from "chess.js"
import {EcoLoader, Opening, OpeningNode} from "./EcoLoader";
import * as Mover from "./Mover"
import './OpeningDriller.css'
import {MovesList} from "./MovesList";
import {OpeningTree} from "./OpeningTree";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

interface OpeningDrillerState {
    treeLoading: boolean,
    game: ChessInstance
    activeId: string
}

class OpeningDriller extends Component<{}, OpeningDrillerState> {

    ecoLoader: EcoLoader = new EcoLoader();
    orientation: "white" | "black" = "black";
    openings: Opening[]
    openingNodes: OpeningNode[]
    openingNodesIdMap: Map<string, OpeningNode>

    state = {
        treeLoading: true,
        game: new Chess(),
        activeId: ""
    };

    componentDidMount() {;
        this.ecoLoader.loadMap().then((openings) => {
            this.openingNodes = openings.rootNodes
            this.openingNodesIdMap = openings.idToNodeMap
            this.setState( {activeId :  Array.from(this.openingNodesIdMap.keys())[0]})
            this.setState({treeLoading: false})
            this.moveForWhite();
        })
    }

    onDrop = ({sourceSquare, targetSquare}: { sourceSquare: Square, targetSquare: Square }) => {
        const playermove = Mover.move({
            move: this.openingNodesIdMap.get(this.state.activeId).moves[this.state.game.history().length],
            game: this.state.game,
            expectedSourceSquare: sourceSquare,
            expectedTargetSquare: targetSquare
        })
        if (!playermove) return
        this.setState({game: this.state.game});
        if(this.resetIfEnd()) return
        const response = Mover.move({
            move: this.openingNodesIdMap.get(this.state.activeId).moves[this.state.game.history().length],
            game: this.state.game
        })
        if (!response) return
        this.setState({game: this.state.game});
        this.resetIfEnd()
    };

    resetIfEnd(){
        if (this.state.game.history().length < this.openingNodesIdMap.get(this.state.activeId).moves.length) {
            return false;
        }
        setTimeout(() => {
            this.setState({game: new Chess()});
            this.moveForWhite()
        }, 1000);
        return true;
    }

    treeCallback = (event, value) => {
        this.setState({
            activeId: value,
            game: new Chess()
        }, this.moveForWhite);
}

    render() {
        if (this.state.treeLoading) return <h2>Loading...</h2>;
        return (
            <div className='sideBySide'>
                <Chessboard
                    id="chessboard"
                    position={this.state.game.fen()}
                    onDrop={this.onDrop}
                    orientation={this.orientation}
                />
                <OpeningTree
                 data={this.openingNodes}
                 onClickCallback={this.treeCallback}
                />
                <MovesList
                    moves={this.openingNodesIdMap.get(this.state.activeId).moves}
                    activeMove={this.state.game.history().length}
                />
            </div>
        )
    }

    private moveForWhite() {
        if (this.orientation === 'white') return
        Mover.move({
            move: this.openingNodesIdMap.get(this.state.activeId).moves[this.state.game.history().length],
            game: this.state.game
        })
        this.setState({game: this.state.game});
    }
}

export default OpeningDriller