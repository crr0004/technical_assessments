import { InvalidFormat } from "./errors";
import { readFileForParsing } from "./parser/parser";
import { handleQuery } from "./query";

describe("Parser produces correct state", () => {
    it("uses test full_tournment", () => {
        const state = readFileForParsing("data/full_tournament.txt");
        const firstMatch = state.stats.get(1)!;
        expect(firstMatch.players.playerTwo).toStrictEqual("Person B")
        expect(firstMatch.players.playerOne).toStrictEqual("Person A")
        expect(firstMatch.winner).toStrictEqual("Person A");
        expect(firstMatch.playerSetsWon.playerOneSets).toStrictEqual(2);
        expect(firstMatch.playerSetsWon.playerTwoSets).toStrictEqual(0);

        const secondMatch = state.stats.get(2)!;
        expect(secondMatch.players.playerOne).toStrictEqual("Person A")
        expect(secondMatch.players.playerTwo).toStrictEqual("Person C")
        expect(secondMatch.playerSetsWon.playerOneSets).toStrictEqual(1);
        expect(secondMatch.playerSetsWon.playerTwoSets).toStrictEqual(2);
        expect(secondMatch.winner).toStrictEqual("Person C");
    });
    it("Throws an error for an unfinished match", () => {
        expect(() => readFileForParsing("data/unfinished_match.txt")).toThrowError(InvalidFormat);
    });
});
describe("Query on tournment", () => {
    it("Scores match", () => {
        const state = readFileForParsing("data/full_tournament.txt");
        expect(handleQuery("Score Match 01", state.stats)).toStrictEqual("Person A defeated Person B\n2 sets to 0");
        expect(handleQuery("Score Match 02", state.stats)).toStrictEqual("Person C defeated Person A\n1 sets to 2");

    });
    it("Errors with unkown match", () => {
        const state = readFileForParsing("data/full_tournament.txt");
        expect(handleQuery("Score Match 03", state.stats)).toStrictEqual("Sorry I couldn't find that match with id 03");

    });
    it("Tallys games won and lost", () => {
        const state = readFileForParsing("data/full_tournament.txt");
        expect(handleQuery("Games Player Person A", state.stats)).toStrictEqual("23 17")
        expect(handleQuery("Games Player Person B", state.stats)).toStrictEqual(`0 12`);

    });
})

// match 02
// person a wins 1 set
// person c wins 1 set
// person c wins 1 set
// person c wins the match