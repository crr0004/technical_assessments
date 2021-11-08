import { InvalidSpareFrame, InvalidStrikeFrame } from "./errors";

const MAX_FRAMES = 10;
export const MAX_PINS = 10;
enum FrameStatus {
    UNROLLED = -1
}
class Frame{
    rolls: [number | FrameStatus, number | FrameStatus];
    constructor(rolls: [number, number]){
        this.rolls = rolls;
    }

}
export class SpareFrame extends Frame{
    constructor(rolls: [number, number]){
        if(rolls[0] + rolls[1] != MAX_PINS){
            throw new InvalidSpareFrame();
        }
        super(rolls);

    }
}
export class StrikeFrame extends Frame{
    constructor(rolls: [number, number]){
        if(rolls[0] !== MAX_PINS || rolls[1] !== 0){
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
    let frame = new Frame([pins, FrameStatus.UNROLLED]);
    let nextFunction = score;

    // Hit a strike, can only happen on the first roll of a new frame
    if(pins === MAX_PINS){
       frame = new StrikeFrame([pins, 0]) ;
       nextFunction = newFrame;
    }
    return {
        frame: frame,
        nextFunction: nextFunction
    }
}
function score(pins: number, currentState: State): State{
    let frame = new Frame([currentState.frame.rolls[0], pins]);

    // Hit a spare
    if(currentState.frame.rolls[0] + pins === MAX_PINS){
       frame = new SpareFrame([currentState.frame.rolls[0], pins]) ;
    }
    return {
        frame: frame,
        nextFunction: newFrame
    }
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
        if(nextState.frame.rolls[0] !== FrameStatus.UNROLLED && nextState.frame.rolls[1] !== FrameStatus.UNROLLED){
            this.scores.push(nextState);
        }
        this.state = nextState;
    }

    score(): number{
        return this.scores.reduce((previousValue, state, currentIndex, array) => { 
            let score = previousValue + (state.frame.rolls[0] + state.frame.rolls[1]);

            // We can't go any further so don't worry about the different types of frames
            if(currentIndex === array.length-1){
                return score;
            }

            if(state.frame instanceof SpareFrame){
                score += array[currentIndex+1].frame.rolls[0];
            }else if(state.frame instanceof StrikeFrame){
                score += array[currentIndex+1].frame.rolls[0] + array[currentIndex+1].frame.rolls[1];
            }

            return score;
        }, 0)
    }
}