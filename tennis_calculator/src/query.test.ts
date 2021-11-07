import { startOfParse } from "./parser/parser";
import { handleQuery, HELP_MESSAGE, NOT_MATCHED_RESPONSE } from "./query";

describe("Query will respond", () => {
    it("Respond with help for unrecognized queries", () => {
        let response = handleQuery("", undefined);
        expect(response).toStrictEqual(NOT_MATCHED_RESPONSE);

        response = handleQuery("help", undefined);
        expect(response).toStrictEqual(HELP_MESSAGE);

    });
    it("Can score match", () => {
        const state = startOfParse("Match: 01", undefined);
        const matchStats = state.stats!;
        matchStats.get(1)!.players = {
            playerOne: "Person A",
            playerTwo: "Person B"
        };
        matchStats.get(1)!.playerSetsWon = {
            playerOneSets: 2,
            playerTwoSets: 0
        };
        const response = handleQuery("Score Match 01", matchStats);
        // Purposely have the line without indentation for multiline formatting
        expect(response).toStrictEqual(`Person A defeated Person B
2 sets to 0`);

    });
    it("Can tally games won and lost", () => {
        let state = startOfParse("Match: 01", undefined);
        state = startOfParse("Match: 02", state);
        const matchStats = state.stats!;
        matchStats.get(1)!.players = {
            playerOne: "Person A",
            playerTwo: "Person B"
        };
        matchStats.get(1)!.playerGames = {
            firstPlayerGames: {
                gamesLost: 10,
                gamesWon: 10
            },
            secondPlayerGames: {
                gamesWon: 0,
                gamesLost: 0
            }
        };
        matchStats.get(2)!.players = {
            playerOne: "Person A",
            playerTwo: "Person B"
        };
        matchStats.get(2)!.playerGames = {
            firstPlayerGames: {
                gamesLost: 7,
                gamesWon: 13
            },
            secondPlayerGames: {
                gamesWon: 0,
                gamesLost: 0
            }
        };
        expect(handleQuery("Games Player Person A", matchStats)).toStrictEqual(`23 17`);

    });

});
