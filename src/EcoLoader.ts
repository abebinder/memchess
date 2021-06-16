import {ShortMove, Square} from "chess.js";
import * as d3 from "d3";
import {DSVRowString} from "d3";

export interface OpeningNode{
    children: OpeningNode[],
    id: string,
    name: string,
    moves: ShortMove[]
}

export class EcoLoader{

    prefixes: string[] = ['a', 'b', 'c', 'd', 'e']
    idToNodeMap: Map<string, OpeningNode> = new Map<string, OpeningNode>()
    rootNodes: OpeningNode[] = []


    public async initialize(){
        this.idToNodeMap = await this.createIdToNodeMap();
        this.rootNodes = await this.createRootNodes(this.idToNodeMap);
    }

    private async createIdToNodeMap() {
        let idToNodeMap = new Map<string, OpeningNode>();
        let openingList = await this.createOpeningList();
        for (const opening of openingList) {
            idToNodeMap.set(opening.id, opening)
        }
        return idToNodeMap
    }

    private async createRootNodes(idToNodeMap: Map<string, OpeningNode>) {
        let openingStringToNodeMap = new Map<string, OpeningNode>();
        let rootNodes: OpeningNode[] = []
        for (const node of idToNodeMap.values()) {
            var isDuplicateName = false;
            for (let i = node.moves.length-1; i>-1; i--) {
                if(i==0) { rootNodes.push(node) }
                const possibleParent = openingStringToNodeMap.get(this.stringify(node.moves.slice(0, i)))
                if(possibleParent){
                    possibleParent.name === node.name ? isDuplicateName = true : possibleParent.children.push(node)
                    break;
                }
            }
            if (!isDuplicateName) { openingStringToNodeMap.set(this.stringify(node.moves), node) }
        }
        return this.sortNodeList(rootNodes)
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



    private async createOpeningList() {
        let openingList: OpeningNode[] = []
        for (const prefix of this.prefixes) {
            const data = await d3.tsv(`https://raw.githubusercontent.com/niklasf/eco/master/${prefix}.tsv`);
            for (const elem of data) {
                const moves = this.createShortMoves(elem)
                openingList.push({
                    name: elem["name"],
                    children: [],
                    id: this.stringify(moves),
                    moves: moves
                })
            }
        }
        return openingList.sort((a, b) => {
            return a.moves.length - b.moves.length || a.name.localeCompare(b.name)
        })
    }

    stringify(arr: ShortMove[]){
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
        return arr;
    }

}