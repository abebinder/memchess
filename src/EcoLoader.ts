
import {ShortMove, Square} from "chess.js";
import * as d3 from "d3";
import { DSVRowString } from "d3";

export interface Opening {
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
}