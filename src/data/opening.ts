import {ShortMove} from "chess.js";

export interface Opening {
    items: Opening[],
    id: string,
    text: string,
    moves: ShortMove[],
    selected?: boolean
}