import { InvalidSpareFrame, InvalidStrikeFrame } from "./errors";

const MAX_FRAMES = 10;
const MAX_PINS = 10;
enum FrameStatus {
    UNROLLED
}
class Frame{
    rolls: [number | FrameStatus, number | FrameStatus];
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

interface State{
    readonly frame: Frame;
    readonly nextFunction: (pins: number, currentFrame: State) => State;
}

function newFrame(pins: number, currentFrame: State): State{
    return {
        frame: new Frame([pins, FrameStatus.UNROLLED]),
        nextFunction: score
    };

}
function score(pins: number, currentState: State): State{
    return {
        frame: new Frame([currentState.frame.rolls[0], pins]),
        nextFunction: newFrame
    }
}

function spare(pins: number): State{
    return {
        frame: new Frame([FrameStatus.UNROLLED, FrameStatus.UNROLLED]),
        nextFunction: newFrame
    };

}

function strike(pins: number): State{
    return {
        frame: new Frame([FrameStatus.UNROLLED, FrameStatus.UNROLLED]),
        nextFunction: newFrame
    };
}

export class Bowling{
    
    scores = Array<State>();
    state: State = {
        frame: new Frame([FrameStatus.UNROLLED, FrameStatus.UNROLLED]),
        nextFunction: newFrame
    };
    roll(pins: number) {
        const nextState = this.state.nextFunction(pins, this.state);
        // Only want to store the state when both rolls have been made
        if(nextState.frame.rolls[0] != FrameStatus.UNROLLED && nextState.frame.rolls[1] != FrameStatus.UNROLLED){
            this.scores.push(nextState);
        }
        this.state = nextState;
    }

    score(): number{
        let score = 0;
        this.scores.forEach((state) => {
            score += (state.frame.rolls[0] + state.frame.rolls[1]);
        })
        return score;
    }
}