import { GameFinished, InvalidRoll, InvalidSpareFrame, InvalidStrikeFrame } from "./errors";

const MAX_FRAMES = 10;
export const MAX_PINS = 10;
enum RollStatus {
    UNROLLED = -1
}
class Frame{
    rolls: [number | RollStatus, number | RollStatus];
    constructor(rolls: [number, number]){
        this.rolls = rolls;
    }
    frameFinished(): boolean{
        return this.rolls[0] !== RollStatus.UNROLLED && this.rolls[1] !== RollStatus.UNROLLED;
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

export class LastFrame extends Frame{
    extraRoll: number | RollStatus;
    constructor(rolls: [number, number | RollStatus], extraRoll: number | RollStatus){
        super(rolls);
        this.extraRoll = extraRoll;
    }
    frameFinished() {
        let frameFinished = true;
        // Haven't rolled yet
        if(this.rolls[0] === RollStatus.UNROLLED || this.rolls[1] === RollStatus.UNROLLED){
            frameFinished = false;
        // Scored a strike
        }else if(this.rolls[0] === MAX_PINS){
            frameFinished = false;
        // Scored a spare
        }else if(this.rolls[0] + this.rolls[1] === MAX_PINS){
            frameFinished = false;
        }else if(this.rolls[0] + this.rolls[1] < MAX_PINS){
            frameFinished = true;
        }
        if(this.extraRoll !== RollStatus.UNROLLED){
            frameFinished = true;
        }

        return frameFinished;
    }
}

interface State{
    readonly frame: Frame;
    readonly nextFunction: (pins: number, currentFrame: State) => State;
}

function newFrame(pins: number, currentFrame: State): State{
    let frame = new Frame([pins, RollStatus.UNROLLED]);
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

function scoreLastFrame(pins: number, currentState: State): State{

    let frame = new LastFrame([pins, RollStatus.UNROLLED], RollStatus.UNROLLED)
    if(currentState.frame instanceof LastFrame){
        if(currentState.frame.rolls[0] === MAX_PINS){
            if(currentState.frame.rolls[1] === RollStatus.UNROLLED){
                currentState.frame.rolls[1] = pins;
            }else{
                currentState.frame.extraRoll = pins;
            }
        }else if(currentState.frame.rolls[0] + currentState.frame.rolls[1] === MAX_PINS){
            currentState.frame.extraRoll = pins;
        }else{
            currentState.frame.rolls[1] = pins;
        }
        // Need to carry the frame forward for the extra rolls
        frame = currentState.frame;
    }
    return {
        frame: frame,
        nextFunction: scoreLastFrame
    }
}

export class Bowling{
    
    scores = Array<State>();
    state: State = {
        frame: new Frame([RollStatus.UNROLLED, RollStatus.UNROLLED]),
        nextFunction: newFrame
    };
    roll(pins: number) {
        if(this.scores.length === MAX_FRAMES){
            throw new GameFinished();
        }
        if(pins < 0 || pins > MAX_PINS){
            throw new InvalidRoll();
        }
        let nextState = this.state.nextFunction(pins, this.state);
        // Only want to store the state when both rolls have been made
        if(nextState.frame.frameFinished()){
            this.scores.push(nextState);

            // Next frame is the last frame so we need to do some special handling
            if(this.scores.length === MAX_FRAMES-1){
                nextState = {
                    frame: nextState.frame,
                    nextFunction: scoreLastFrame
                }
            }
        }

        this.state = nextState;
    }

    score(): number{
        return this.scores.reduce((previousValue, state, currentIndex, array) => { 
            let score = previousValue + (state.frame.rolls[0] + state.frame.rolls[1]);

            // We can't go any further so don't worry about the different types of frames
            if(currentIndex === array.length-1){
                if(state.frame instanceof LastFrame && state.frame.extraRoll !== RollStatus.UNROLLED){
                    score += state.frame.extraRoll;
                }
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