import { Square } from "chess.js";

export class Move{
    public whiteSourceSquare: Square;
    public whiteTargetSquare: Square;
    public blackSourceSquare: Square;
    public blackTargetSquare: Square;


    constructor(whiteSourceSquare: Square, whiteTargetSquare: Square, blackSourceSquare: Square, blackTargetSquare: Square) {
        this.whiteSourceSquare = whiteSourceSquare;
        this.whiteTargetSquare = whiteTargetSquare;
        this.blackSourceSquare = blackSourceSquare;
        this.blackTargetSquare = blackTargetSquare;
    }
}

