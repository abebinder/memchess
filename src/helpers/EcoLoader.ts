import {ShortMove, Square} from "chess.js";
import * as d3 from "d3";
import {DSVRowString} from "d3";

export interface OpeningNode{
    items: OpeningNode[],
    id: string,
    text: string,
    moves: ShortMove[],
    selected?: boolean
}

export class EcoLoader{

    prefixes: string[] = ['a', 'b', 'c', 'd', 'e']
    rootNodes: OpeningNode[] = []


    public async initialize():Promise<void>{
        this.rootNodes = await this.createRootNodes();
        this.rootNodes[0].selected = true;
    }

    private async createRootNodes() {
        const openingStringToNodeMap = new Map<string, OpeningNode>();
        const rootNodes: OpeningNode[] = []
        const openingList = await this.createOpeningList();
        for (const node of openingList) {
            let isDuplicateName = false;
            for (let i = node.moves.length-1; i>-1; i--) {
                if(i==0) { rootNodes.push(node) }
                const possibleParent = openingStringToNodeMap.get(this.stringify(node.moves.slice(0, i)))
                if(possibleParent){
                    possibleParent.text === node.text ? isDuplicateName = true : possibleParent.items.push(node)
                    break;
                }
            }
            if (!isDuplicateName) { openingStringToNodeMap.set(this.stringify(node.moves), node) }
        }
        return this.sortNodeList(rootNodes)
    }


    createShortMoves(data: DSVRowString): ShortMove[] {
        const movesAsSpaceSeperatedString = data["moves"] as string;
        const moves = movesAsSpaceSeperatedString.split(" ")
        const arr: ShortMove [] = [];
        for (const elem of moves) {
            const shortMove = {from: elem.substring(0, 2) as Square, to: elem.slice(-2) as Square}
            arr.push(shortMove);
        }
        return arr;
    }



    private async createOpeningList() {
        const openingList: OpeningNode[] = []
        for (const prefix of this.prefixes) {
            const data = await d3.tsv(`https://raw.githubusercontent.com/niklasf/eco/master/${prefix}.tsv`);
            for (const elem of data) {
                const moves = this.createShortMoves(elem)
                openingList.push({
                    text: elem["name"],
                    items: [],
                    id: this.stringify(moves),
                    moves: moves
                })
            }
        }
        return openingList.sort((a, b) => {
            return a.moves.length - b.moves.length || a.text.localeCompare(b.text)
        })
    }

    stringify(arr: ShortMove[]): string {
        let unraveled = ""
        for (const shortMove of arr) {
            unraveled = unraveled + shortMove.from + shortMove.to
        }
        return unraveled
    }

    sortNodeList(arr: OpeningNode[]): OpeningNode[] {
        arr.sort((a, b) => {
            return a.text.localeCompare(b.text)
        })
        for (const openingNode of arr) {
            if(openingNode.items) this.sortNodeList(openingNode.items)
        }
        return arr;
    }

}