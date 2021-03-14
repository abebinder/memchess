export class Move{
    private whiteSourceSquare: String;
    private whiteTargetSquare: String;
    private blackSourceSquare: String;
    private blackTargetSquare: String;


    constructor(whiteSourceSquare: String, whiteTargetSquare: String, blackSourceSquare: String, blackTargetSquare: String) {
        this.whiteSourceSquare = whiteSourceSquare;
        this.whiteTargetSquare = whiteTargetSquare;
        this.blackSourceSquare = blackSourceSquare;
        this.blackTargetSquare = blackTargetSquare;
    }
}

