
import {ShortMove, Square} from "chess.js";
import * as d3 from "d3";
import { DSVRowString } from "d3";
import { v4 as uuidv4 } from 'uuid';


export interface Opening {
    name: string,
    moves: ShortMove[]
}

export interface OpeningNode{
    children?: OpeningNode[],
    id: string,
    name: string,
    moves: ShortMove[]
}

export class EcoLoader{

    prefixes: string[] = ['a', 'b', 'c', 'd', 'e']

    public async load() {
        const openingList: Opening[] = []
        const openingNameToShortMoveMap = new Map<string, ShortMove[]>();
        for (const prefix of this.prefixes) {
            const data = await d3.tsv(`data/eco/${prefix}.tsv`);
            for (const elem of data) {
                openingList.push({
                    name: elem["name"],
                    moves: this.createShortMoves(elem)
                })
            }
        }
        return openingList.sort((a, b) => {
            return a.name.localeCompare(b.name);
        })
    }

    createShortMoves(data: DSVRowString): ShortMove[] {
        var movesAsSpaceSeperatedString = data["moves"] as string;
        var moves = movesAsSpaceSeperatedString.split(" ")
        let arr: ShortMove [] = [];
        for (const elem of moves) {
            const shortMove = {from: elem.substring(0, 2) as Square, to: elem.slice(-2) as Square}
            arr.push(shortMove);
        }
        return arr;
    }


    public async loadMap() {
        let openingList: Opening[] = []
        for (const prefix of this.prefixes) {
            const data = await d3.tsv(`data/eco/${prefix}.tsv`);
            for (const elem of data) {
                openingList.push({
                    name: elem["name"],
                    moves: this.createShortMoves(elem)
                })
            }
        }
        openingList = openingList.sort((a, b) => {
            return a.moves.length - b.moves.length
        })
        let someMap = new Map<string, OpeningNode>();
        let someNodeList: OpeningNode[] = []
        for (const opening of openingList) {
            let node: OpeningNode  = {
                id: uuidv4(),
                moves: opening.moves,
                name: opening.name
            }
            someMap.set(this.unravel(opening.moves), node)
            for (let i = opening.moves.length-1; i>-1; i--) {
                if(i==0) {
                    someNodeList.push(node)
                    break;
                }
                const possibleParent = someMap.get(this.unravel(opening.moves.slice(0, i)))
                if(possibleParent){
                   if(possibleParent.children) {
                       possibleParent.children.push(node)}
                   else{
                       possibleParent.children = [node]
                   }
                   break;
                }

            }
        }
        return someNodeList;
    }

    unravel(arr: ShortMove[]){
        let unraveled = ""
        for (const shortMove of arr) {
            unraveled = unraveled + shortMove.from + shortMove.to
        }
        return unraveled
    }


}