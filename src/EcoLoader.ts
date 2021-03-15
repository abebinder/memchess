
import {ShortMove, Square} from "chess.js";
import * as d3 from "d3";



export class EcoLoader{

    public  load(tsvFilePath: string) : Map<string, ShortMove>{

        console.log("Loading tsv")
        // @ts-ignore
        const derp = d3.tsv("data/eco/a.tsv", function(data){
            console.log(data)
        });
        return new Map<string, ShortMove>();
    }



}