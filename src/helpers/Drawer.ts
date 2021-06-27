import {OpeningDrillerState} from "../components/OpeningDriller";


export function drawArrow(input: OpeningDrillerState)  {

    var arrow = []

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

