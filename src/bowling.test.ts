import {Bowling, LastFrame, MAX_PINS, SpareFrame, StrikeFrame} from './bowling';
import { GameFinished, InvalidRoll, InvalidSpareFrame, InvalidStrikeFrame } from './errors';
describe("Can bowl with scoring", () => {
    it("Scores non-special frames", () => {
        const bowling = new Bowling();
        bowling.roll(5);
        bowling.roll(4);
        expect(bowling.score()).toEqual(5+4);
    })
    it("Scores a spare correctly", () => {
        const bowling = new Bowling();
        // Spare
        bowling.roll(5);
        bowling.roll(5);

        bowling.roll(5);
        bowling.roll(4);

        expect(bowling.score()).toEqual((5 + 5 + 5) + (5 + 4));

    });
    it("Scores a spare correctly when no further frames exist", () => {
        const bowling = new Bowling();
        // Spare
        bowling.roll(5);
        bowling.roll(5);


        expect(bowling.score()).toEqual(5 + 5);
    })
    it("Scores a strike correctly when no further frames exist", () => {
        const bowling = new Bowling();
        // Spare
        bowling.roll(10);

        expect(bowling.score()).toEqual(10);
    })
    it("Scores a strike correctly", () => {
        const bowling = new Bowling();
        // Strike
        bowling.roll(MAX_PINS);

        bowling.roll(5);
        bowling.roll(4);

       expect(bowling.score()).toEqual((MAX_PINS+5+4)+(5+4));

    })

    it("Scores last frame with a strike correctly", () => {
        const bowling = new Bowling();

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(10);
        expect(bowling.state.frame.frameFinished()).toBe(false);
        bowling.roll(4);
        expect(bowling.state.frame.frameFinished()).toBe(false);
        bowling.roll(4);
        expect(bowling.state.frame.frameFinished()).toBe(true);

        expect(bowling.state.frame.rolls).toStrictEqual([10, 4]);
        expect((bowling.state.frame as LastFrame).extraRoll).toStrictEqual(4);

        expect(bowling.score()).toEqual((9*8)+(10+4+4));
        expect(() => bowling.roll(5)).toThrowError(GameFinished);

    });

    it("Scores last frame with no strike or spare correctly", () => {
        const bowling = new Bowling();

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(5);
        expect(bowling.state.frame.frameFinished()).toBe(false);

        bowling.roll(4);
        expect(bowling.state.frame.frameFinished()).toBe(true);

        expect(bowling.state.frame.rolls).toStrictEqual([5, 4]);

        expect(bowling.score()).toEqual((9*8)+(5+4));

        expect(() => bowling.roll(5)).toThrowError(GameFinished);
    });

    it("Scores last with a spare correctly", () => {
        const bowling = new Bowling();

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(4);
        bowling.roll(4);

        bowling.roll(5);
        expect(bowling.state.frame.frameFinished()).toBe(false);

        bowling.roll(5);
        expect(bowling.state.frame.frameFinished()).toBe(false);

        bowling.roll(4);
        expect(bowling.state.frame.frameFinished()).toBe(true);

        expect(bowling.state.frame.rolls).toStrictEqual([5, 5]);
        expect((bowling.state.frame as LastFrame).extraRoll).toStrictEqual(4);

        expect(bowling.score()).toEqual((9*8)+(5+5+4));

        expect(() => bowling.roll(5)).toThrowError(GameFinished);

    });
    it("Throws error with bad input for spare frame", () =>{
        expect(() => new SpareFrame([5, 4])).toThrowError(InvalidSpareFrame);
    })
    it("Throws error with bad input for strike frame", () => {
        expect(() => new StrikeFrame([1, 3])).toThrowError(InvalidStrikeFrame);
        expect(() => new StrikeFrame([10, 3])).toThrowError(InvalidStrikeFrame);
    })
    it("Throws an error with a bad roll number", () => {
        expect(() => new Bowling().roll(-1)).toThrowError(InvalidRoll);
        expect(() => new Bowling().roll(11)).toThrowError(InvalidRoll);
    })
})