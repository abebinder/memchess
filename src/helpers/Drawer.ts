import {OpeningDrillerState} from "../components/OpeningDriller";
import {ShortMove} from "chess.js";

export interface Drawable {
    enabled: boolean,
    autoShapes: Arrow[]
}

export interface Arrow {
    orig: ShortMove,
    dest: ShortMove,
    brush: string
}

export function drawArrow(input: OpeningDrillerState): Drawable  {

    let arrow = []

    if (input.game.history().length < input.moves.length && input.shouldDraw) {
        arrow = [
            {
                orig: input.moves[input.game.history().length].from,
                dest: input.moves[input.game.history().length].to,
                brush: 'green'
            }
        ]
    }

    return {
        enabled: false,
        autoShapes:arrow
    }

}

