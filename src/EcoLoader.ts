
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
        let openingList = await this.createOpeningList();
        console.log("opening list created")
        console.log(openingList)
        let openingNodeChildMap = new Map<string, OpeningNode>();
        let idToNodeMap = new Map<string, OpeningNode>();
        let rootNodes: OpeningNode[] = []
        for (const opening of openingList) {
            let node: OpeningNode  = {
                id: uuidv4(),
                moves: opening.moves,
                name: opening.name
            }
            idToNodeMap.set(node.id, node)
            var addToMap = true;
            for (let i = opening.moves.length-1; i>-1; i--) {
                if(i==0) {
                    rootNodes.push(node)
                    break;
                }
                const possibleParent = openingNodeChildMap.get(this.unravel(opening.moves.slice(0, i)))
                if(possibleParent){
                    if(possibleParent.name === node.name){
                        addToMap = false;
                        break;
                    }
                   if(possibleParent.children) {
                       possibleParent.children.push(node)}
                   else{
                       possibleParent.children = [node]
                   }
                   break;
                }

            }
            if (addToMap) {
                openingNodeChildMap.set(this.unravel(opening.moves), node)
            }
        }
        this.sortNodeList(rootNodes)
        return {idToNodeMap: idToNodeMap, rootNodes: rootNodes};
    }


    private async createOpeningList() {
        console.log("creating opening list")
        let openingList: Opening[] = []
        for (const prefix of this.prefixes) {
            console.log("invoking d3")
            const data = await d3.tsv(`${process.env.PUBLIC_URL}/data/eco/${prefix}.tsv`);
            console.log("invoked d3")
            console.log(data)
            for (const elem of data) {
                openingList.push({
                    name: elem["name"],
                    moves: this.createShortMoves(elem)
                })
            }
        }
        return openingList.sort((a, b) => {
            return a.moves.length - b.moves.length || a.name.localeCompare(b.name)
        })
    }

    unravel(arr: ShortMove[]){
        let unraveled = ""
        for (const shortMove of arr) {
            unraveled = unraveled + shortMove.from + shortMove.to
        }
        return unraveled
    }

    sortNodeList(arr: OpeningNode[]){
        arr.sort((a, b) => {
            return a.name.localeCompare(b.name)
        })
        for (const openingNode of arr) {
            if(openingNode.children) this.sortNodeList(openingNode.children)
        }
    }


}