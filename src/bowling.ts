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
    // We don't use the next frame here however we still need for the signature so we ignore the lint warning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    scoreFrame(currentIndex: number, frames: Array<State>): number{
        return this.rolls[0] + this.rolls[1];

    }
}
export class SpareFrame extends Frame{
    constructor(rolls: [number, number]){
        if(rolls[0] + rolls[1] != MAX_PINS){
            throw new InvalidSpareFrame();
        }
        super(rolls);
    }
    scoreFrame(currentIndex: number, states: Array<State>): number{
        return super.scoreFrame(currentIndex, states) + (states[currentIndex+1]?.frame.rolls[0] || 0);
    }
}
export class StrikeFrame extends Frame{
    constructor(rolls: [number, number]){
        if(rolls[0] !== MAX_PINS || rolls[1] !== 0){
            throw new InvalidStrikeFrame();
        }
        super(rolls);
    }
    scoreFrame(currentIndex: number, states: Array<State>): number{
        let score = super.scoreFrame(currentIndex, states);
        const nextFrame = states[currentIndex+1]?.frame;

        score += (nextFrame?.rolls[0] || 0) + (nextFrame?.rolls[1] || 0);

        // When we have two strikes in a row, we need to look even further ahead to get the right score
        if(nextFrame instanceof StrikeFrame){
            score += (states[currentIndex+2]?.frame.rolls[0] || 0)
        }

        return score;
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
    scoreFrame(currentIndex: number, states: Array<State>): number{
        let score = super.scoreFrame(currentIndex, states);
        if(this.extraRoll !== RollStatus.UNROLLED){
            score += this.extraRoll;
        }
        return score;
    }
    
}

interface State{
    readonly frame: Frame;
    readonly nextFunction: (pins: number, currentFrame: State) => State;
}

// We don't use the state variable in the the new frame 
// because it is being created here however still need it for the signature so we ignore the lint warning
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function newFrame(pins: number, _: State): State{
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

function rollLastFrame(pins: number, currentState: State): State{

    /**
     * This is a bit of a mess of a function. The last frame is a bit of special one because of the interaction between
     * spares and strikes with the extra roll. As long as we keep this more humble code to the LastFrame class and this function,
     * it should be okay.
     * 
     * Basically what this is does allows for MAX_PINS as the first roll to roll twice again.
     * However when the first roll isn't a strike, we roll normally unless we get a spare, which we allow for an extra roll.
     */
    let frame = new LastFrame([pins, RollStatus.UNROLLED], RollStatus.UNROLLED)
    if(currentState.frame instanceof LastFrame){
        // Hit a strike so two more rolls
        if(currentState.frame.rolls[0] === MAX_PINS){
            if(currentState.frame.rolls[1] === RollStatus.UNROLLED){
                currentState.frame.rolls[1] = pins;
            }else{
                currentState.frame.extraRoll = pins;
            }
        // Hit a spare so put the roll in the extra slot
        }else if(currentState.frame.rolls[0] + currentState.frame.rolls[1] === MAX_PINS){
            currentState.frame.extraRoll = pins;
        }else{
            // No strike but this could be a spare, let the finish function figure it out
            currentState.frame.rolls[1] = pins;
        }
        // Need to carry the frame forward for the extra rolls
        frame = currentState.frame;
    }
    return {
        frame: frame,
        nextFunction: rollLastFrame
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
        // Only want to store the state when the frame is finished
        if(nextState.frame.frameFinished()){
            this.scores.push(nextState);

            // Next frame is the last frame so we need to do some special handling
            if(this.scores.length === MAX_FRAMES-1){
                nextState = {
                    frame: nextState.frame,
                    nextFunction: rollLastFrame
                }
            }
        }

        this.state = nextState;
    }

    score(): number{
        return this.scores.reduce((previousValue, state, currentIndex, array) => { 
            return previousValue + state.frame.scoreFrame(currentIndex, array);
        }, 0)
    }
}