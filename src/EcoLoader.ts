
import {ShortMove, Square} from "chess.js";
import * as d3 from "d3";



export class EcoLoader{


    public  load() : Map<string, ShortMove>{

        console.log("Loading tsv")

        const my_map = new Map<any, any>();


        // @ts-ignore
        const derp = d3.tsv("data/eco/a.tsv", (data: any) => {
            my_map.set(data.name, this.createShortMoves(data))
        });



        console.log(my_map)
        return my_map;
    }

    createShortMoves(data: any): ShortMove[]{
        var moves= data.moves.split(" ")
        let arr: ShortMove [] = [];
        for (const elem of moves) {
            const shortMove = {from: elem.substring(0,2), to: elem.slice(-2)}
            arr.push(shortMove);
        }
        return arr;
    }





}