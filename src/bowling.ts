import { InvalidSpareFrame, InvalidStrikeFrame } from "./errors";

const MAX_FRAMES = 10;
const PINS = 10;
class Frame{
    rolls: [number, number];
    constructor(rolls: [number, number]){
        this.rolls = rolls;
    }

}
export class SpareFrame extends Frame{
    constructor(rolls: [number, number]){
        if(rolls[0] + rolls[1] != 10){
            throw new InvalidSpareFrame();
        }
        super(rolls);

    }
}
export class StrikeFrame extends Frame{
    constructor(rolls: [number, number]){
        if(rolls[0] != 10 || rolls[1] != 0){
            throw new InvalidStrikeFrame();
        }
        super(rolls);
    }
}

export class Bowling{

    scores = Array<Number>(MAX_FRAMES);
    roll(pins: number) {
        
    }

    score(): number{
        return 0;
    }
}