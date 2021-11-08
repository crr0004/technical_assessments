import {Bowling, SpareFrame, StrikeFrame} from './bowling';
import { InvalidSpareFrame, InvalidStrikeFrame } from './errors';
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

       expect(bowling.score()).toEqual((5+5+5)+(5+4));

    });
    it("Scores a strike correctly", () => {
        const bowling = new Bowling();
        // Strike
        bowling.roll(10);

        bowling.roll(5);
        bowling.roll(4);

       expect(bowling.score()).toEqual((10+5+4)+(5+4));

    })

    it("Throws error with bad input for spare frame", () =>{
        expect(() => new SpareFrame([5, 4])).toThrowError(InvalidSpareFrame);
    })
    it("Throws error with bad input for strike frame", () => {
        expect(() => new StrikeFrame([1, 3])).toThrowError(InvalidStrikeFrame);
        expect(() => new StrikeFrame([10, 3])).toThrowError(InvalidStrikeFrame);
    })
})