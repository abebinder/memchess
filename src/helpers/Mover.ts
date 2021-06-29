import {ChessInstance, ShortMove, Square} from "chess.js"

export interface MoveInput {
    move: ShortMove | undefined,
    game: ChessInstance,
    callback: (game: ChessInstance) => void,
    expectedSourceSquare?: Square,
    expectedTargetSquare?: Square,
}

export function move(input: MoveInput): boolean {
    if (!validateInput(input)) {
        input.callback(input.game)
        return false
    }
    const validatedMove = input.move as ShortMove
    input.game.move({
        from: validatedMove.from,
        to: validatedMove.to,
        promotion: "q" // always promote to a queen for example simplicity
    });
    input.callback(input.game)
    return true;
}

function validateInput(input: MoveInput): boolean {
    return input.move != undefined && (!input.expectedSourceSquare
        || !input.expectedTargetSquare
        || (input.move.from === input.expectedSourceSquare
            && input.move.to === input.expectedTargetSquare))
}