
import {ShortMove, Square} from "chess.js";
import * as d3 from "d3";



export class EcoLoader{


    public  load() : Map<string, ShortMove[]>{

        console.log("Loading tsv")
        const my_map = new Map<string, ShortMove[]>();
        const derp = d3.tsv("data/eco/a.tsv").then((data: any)=> {
            console.log("data is ")
            console.log(data)
            for (const elem of data){
                my_map.set(elem.name, this.createShortMoves(elem))
            }
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