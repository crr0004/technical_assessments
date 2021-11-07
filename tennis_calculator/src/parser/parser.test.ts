import { FileNotFound, InvalidFormat, InvalidLineFormat } from "../errors";
import { ParsingState } from "../types";
import { GAMES_TO_WIN_SET, parseLines, parsePlayerLine, POINTS_TO_WIN_GAME, readFileForParsing, parseScoreLine, SETS_TO_WIN_MATCH, startOfParse } from "./parser";

describe("Parser can read files", () => {
    it("Throws error when file not found", () => {
        expect(() => readFileForParsing("")).toThrowError(FileNotFound);
    });
    it("Should throw error when lines aren't seperated by new lines", () => {
        expect(() => parseLines("abc")).toThrowError(InvalidFormat);
        expect(() => parseLines("")).toThrowError(InvalidFormat);
    });
});

describe("Each line parses correctly", () =>{
    let defaultState = {} as ParsingState;
    beforeEach(() => {
        defaultState = {
            currentMatchId: 1,
            players: {
                playerOne: "",
                playerTwo: ""
            },
            playersScore: {
                playerOneScore: 0,
                playerTwoScore: 0
            },
            playerGamesWon: {
                playerOneGames: 0,
                playerTwoGames: 0
            },
            playerSetsWon: {
                playerOneSets: 0,
                playerTwoSets: 0
            },
            matchWinner: "",
            previousStateFunction: startOfParse,
            nextStateFunction: parsePlayerLine,
            stats: new Map() // only reset this if it hasn't been set before
        };
        defaultState.stats.set(1, {
            playerGames: {
                firstPlayerGames: {
                    gamesWon: 0,
                    gamesLost: 0
                },
                secondPlayerGames: {
                    gamesWon: 0,
                    gamesLost: 0
                }
            },
            playerSetsWon: {
                playerOneSets: 0,
                playerTwoSets: 0
            },
            players: {
                playerOne: "",
                playerTwo: ""
            },
            winner: ""
        });
    });

    it("Start should throw an error when the line isn't correctly formatted", () => {
        expect(() => startOfParse("abc", undefined)).toThrowError(InvalidLineFormat)
        expect(() => parsePlayerLine("abc", defaultState)).toThrowError(InvalidLineFormat)
        expect(() => parsePlayerLine("Person Avs Person B", defaultState)).toThrowError(InvalidLineFormat)
        expect(() => parsePlayerLine("Person A vs Person A", defaultState)).toThrowError(InvalidLineFormat)
        expect(() => parseScoreLine("3", defaultState)).toThrowError(InvalidLineFormat)
    });
    it("Start should initilize the state correctly", () => {
        const line = "Match: 01";
        const state = startOfParse(line, undefined);
        expect(state.nextStateFunction).toBe(parsePlayerLine);
        expect(state.currentMatchId).toStrictEqual(1);
        expect(state.players.playerOne).toStrictEqual("");
        expect(state.players.playerTwo).toStrictEqual("");
        expect(state.playersScore.playerOneScore).toStrictEqual(0);
        expect(state.playersScore.playerTwoScore).toStrictEqual(0);
        expect(state.playerSetsWon.playerOneSets).toStrictEqual(0);
        expect(state.playerSetsWon.playerTwoSets).toStrictEqual(0);

    });
    it("Player names should be parsed correctly", () => {
        const line = "Person A vs Person B";
        const state = parsePlayerLine(line, defaultState);
        expect(state.nextStateFunction).toBe(parseScoreLine);
        expect(state.players.playerOne).toStrictEqual("Person A");
        expect(state.players.playerTwo).toStrictEqual("Person B");
    });
    it("Score should be parsed correctly", () => {
        const line = "0";
        let state = parseScoreLine(line, defaultState);
        expect(state.nextStateFunction).toBe(parseScoreLine);
        expect(state.playersScore.playerOneScore).toStrictEqual(1);
        expect(state.playersScore.playerTwoScore).toStrictEqual(0);

        state = parseScoreLine("1", state);
        expect(state.playersScore.playerOneScore).toStrictEqual(1);
        expect(state.playersScore.playerTwoScore).toStrictEqual(1);
    });
    describe("Base cases for scoring", () => {
        it("Player 1 wins all points", () => {
            const line = "0";
            defaultState.playersScore.playerOneScore = POINTS_TO_WIN_GAME - 1;

            const state = parseScoreLine(line, defaultState);
            expect(state.nextStateFunction).toBe(parseScoreLine);
            expect(state.playerGamesWon.playerOneGames).toStrictEqual(1);
            expect(state.playerGamesWon.playerTwoGames).toStrictEqual(0);

            expect(state.playersScore.playerOneScore).toStrictEqual(0);
            expect(state.playersScore.playerTwoScore).toStrictEqual(0);

        });
        it("Player won't win game unless they are ahead enough", () => {
            const line = "0";
            defaultState.playersScore.playerOneScore = POINTS_TO_WIN_GAME;
            defaultState.playersScore.playerTwoScore = POINTS_TO_WIN_GAME;

            const state = parseScoreLine(line, defaultState);
            expect(state.nextStateFunction).toBe(parseScoreLine);
            expect(state.playerGamesWon.playerOneGames).toStrictEqual(0);
            expect(state.playerGamesWon.playerTwoGames).toStrictEqual(0);
            // expect(state.playersScore).toStrictEqual([0, 0]);

        });
        it("Player 1 wins enough games for set", () => {
            const line = "0";
            defaultState.playersScore.playerOneScore = 3;
            defaultState.playerGamesWon.playerOneGames = GAMES_TO_WIN_SET - 1;

            const state = parseScoreLine(line, defaultState);
            expect(state.nextStateFunction).toBe(parseScoreLine);

            expect(state.playerGamesWon.playerOneGames).toStrictEqual(0);
            expect(state.playerGamesWon.playerTwoGames).toStrictEqual(0);
            
            expect(state.playerSetsWon.playerOneSets).toStrictEqual(1);
            expect(state.playerSetsWon.playerTwoSets).toStrictEqual(0)
        
            expect(state.playersScore.playerOneScore).toStrictEqual(0);
            expect(state.playersScore.playerTwoScore).toStrictEqual(0);
        });
        it("Player 1 wins enough sets for match", () => {
            const line = "0";
            defaultState.playersScore.playerOneScore = 3;
            defaultState.playerGamesWon.playerOneGames = GAMES_TO_WIN_SET - 1;
            defaultState.playerSetsWon.playerOneSets = SETS_TO_WIN_MATCH - 1;

            const state = parseScoreLine(line, defaultState);
            expect(state.nextStateFunction).toBe(startOfParse);
            expect(state.playerGamesWon.playerOneGames).toStrictEqual(0);
            expect(state.playerGamesWon.playerTwoGames).toStrictEqual(0);

            expect(state.matchWinner).toStrictEqual(defaultState.players.playerOne);

            expect(state.playersScore.playerOneScore).toStrictEqual(0);
            expect(state.playersScore.playerTwoScore).toStrictEqual(0);

        });
        it("Match is stored and resets", () => {
            const line = "0";
            defaultState.playersScore.playerOneScore = 3;
            defaultState.playerGamesWon.playerOneGames = GAMES_TO_WIN_SET - 1;
            defaultState.playerSetsWon.playerOneSets = SETS_TO_WIN_MATCH - 1;
            let state = parseScoreLine(line, defaultState);

            const stat = state.stats.get(defaultState.currentMatchId);
            expect(stat!.playerSetsWon).toStrictEqual(defaultState.playerSetsWon);
            expect(stat!.players).toStrictEqual(defaultState.players);
            expect(stat!.winner).toStrictEqual(defaultState.players.playerOne);
            expect(state.nextStateFunction).toStrictEqual(startOfParse);

            state = startOfParse("Match: 02", state);
            expect(state.currentMatchId).toStrictEqual(2);
            expect(state.matchWinner).toBeFalsy();

            expect(state.players.playerOne).toStrictEqual("");
            expect(state.players.playerTwo).toStrictEqual("");

            expect(state.playerGamesWon.playerOneGames).toStrictEqual(0);
            expect(state.playerGamesWon.playerTwoGames).toStrictEqual(0);

            expect(state.playersScore.playerOneScore).toStrictEqual(0);
            expect(state.playersScore.playerTwoScore).toStrictEqual(0);

            expect(state.playerSetsWon.playerOneSets).toStrictEqual(0);
            expect(state.playerSetsWon.playerTwoSets).toStrictEqual(0);
        });
        it("Throws an error with duplicate match ids", () => {
            const line = "0";
            defaultState.playersScore.playerOneScore = 3;
            defaultState.playerGamesWon.playerOneGames = GAMES_TO_WIN_SET - 1;
            defaultState.playerSetsWon.playerOneSets = SETS_TO_WIN_MATCH - 1;
            defaultState.currentMatchId = 1;
            const state = parseScoreLine(line, defaultState);

            expect(() => startOfParse(`Match: 01`, state)).toThrowError(InvalidFormat);

        });
    });

});