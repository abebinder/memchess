
import {ShortMove, Square} from "chess.js";
import * as d3 from "d3";
import { DSVRowArray, DSVRowString } from "d3";
export class EcoLoader{

    public  load() : Map<string, ShortMove[]>{
        console.log("Loading tsv")
        const openingNameToShortMoveMap = new Map<string, ShortMove[]>();
        d3.tsv("data/eco/a.tsv").then((data: DSVRowArray<string>)=> {
            for (const elem of data){
                openingNameToShortMoveMap.set(elem["name"] as string, this.createShortMoves(elem))
            }});
        console.log(openingNameToShortMoveMap)
        return openingNameToShortMoveMap;
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