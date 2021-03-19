
import {ShortMove, Square} from "chess.js";
import * as d3 from "d3";
import { DSVRowArray, DSVRowString } from "d3";
export class EcoLoader{

    prefixes: string[] = ['a', 'b', 'c', 'd', 'e']

    public async load() {
        const openingNameToShortMoveMap = new Map<string, ShortMove[]>();
        for (const prefix of this.prefixes) {
            const data = await d3.tsv(`data/eco/${prefix}.tsv`);
            for (const elem of data) {
                openingNameToShortMoveMap.set(elem["name"] as string, this.createShortMoves(elem));
            }
        }
        var mapAsc = new Map([...openingNameToShortMoveMap.entries()].sort());
        return mapAsc;
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