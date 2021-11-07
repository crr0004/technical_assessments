import * as fs from 'fs';
import { InvalidFormat, FileNotFound, InvalidLineFormat } from '../errors';
import { ParsingState } from '../types';

const MATCH_LINE_REGEX = /^Match: (\d+)$/;
const PLAYER_LINE_REGEX = /^(.+) vs (.+)$/;
const SCORE_LINE_REGEX = /^0|1$/;

export const POINTS_TO_WIN_GAME = 4;
export const POINTS_ADVANTAGE_REQUIED_TO_WIN = 2;
export const GAMES_TO_WIN_SET = 6;
export const SETS_TO_WIN_MATCH = 2;

// With all these functions, there is a large assumption that there is ever only two players.
// Changing this for teams wouldn't be too hard as it would just be a semantic change from player to teams
// Changing for more than two sides would be require a lot of changes

/**
 * Parses a match line and generates a new state if required. This includes the stats object
 * @param line match line to parse
 * @param state running parse state or undefined to create a new one
 * @returns the modified state or a new state
 */
export function startOfParse(line: string, state?: ParsingState): ParsingState {
    const lineRegexMatch = line.match(MATCH_LINE_REGEX);
    if(!lineRegexMatch){
        throw new InvalidLineFormat("Line must match format", line, MATCH_LINE_REGEX);
    }

    const matchId = Number(lineRegexMatch[1]); // regex enforces number pattern

    if(state?.stats?.get(matchId)){
        throw new InvalidFormat(`Can not have duplicate match ids ${matchId}`);
    }
    state = {
        currentMatchId: matchId,
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
        stats: state?.stats || new Map() // only reset this if it hasn't been set before
    };

    // Drop the empty match stat object in so we can add to it later
    state.stats.set(matchId, {
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

    return state
}

/**
 * Parses the line for player names and adds them to the state
 * @param line line to parse for player names
 * @param state running parse state
 * @returns modified state
 */
export function parsePlayerLine(line: string, state: ParsingState): ParsingState {
    const playerLineMatch = line.match(PLAYER_LINE_REGEX);
    if(!playerLineMatch){
        throw new InvalidLineFormat("Player line must match format", line, PLAYER_LINE_REGEX);
    }
    if(playerLineMatch[1] === playerLineMatch[2]){
       throw new InvalidLineFormat("Players cannont be identical", line, PLAYER_LINE_REGEX);
    }
    state.players = {
        playerOne: playerLineMatch[1], 
        playerTwo: playerLineMatch[2]
    };
    state.nextStateFunction = parseScoreLine;
    state.previousStateFunction = parsePlayerLine;
    return state;
}

/**
 * Parse a line for a score and update the state for any points, games, sets or matches won.
 * @param line line to parse
 * @param state running parse state
 * @returns modified state
 */
export function parseScoreLine(line: string, state: ParsingState): ParsingState {
    if(!line.match(SCORE_LINE_REGEX)){
        throw new InvalidLineFormat("Score line must match format", line, SCORE_LINE_REGEX);
    }
    // You could drop the explicit === here for implicity boolean logic, but this makes it really clear what is going on
    const scorer = Number(line);
    if(scorer === 0){
        state.playersScore.playerOneScore++;
    }else{
        state.playersScore.playerTwoScore++;
    }
    

    state.nextStateFunction = parseScoreLine;
    state.previousStateFunction = parseScoreLine;

    // this can modify the next state function so put it last
    state = pointScored(state);

    return state;
}

// The following functions and some before have some code duplication but because it is so localized and to remove
// it would make things more complicated, I am leave it.

/**
 * Processes the next for the state after a point has been scored 
 * @param state running parse state
 * @returns modified state after a point has been scored
 */
export function pointScored(state: ParsingState): ParsingState{
    // This may fail but can't think of when it might. Measuring the difference may not be what we want
    const pointsDifference = Math.abs(state.playersScore.playerOneScore - state.playersScore.playerTwoScore);

    if(state.playersScore.playerOneScore >= POINTS_TO_WIN_GAME && pointsDifference >= POINTS_ADVANTAGE_REQUIED_TO_WIN){
        state.playerGamesWon.playerOneGames++;
        state.playersScore = {
            playerOneScore: 0,
            playerTwoScore: 0
        }
        state.stats.get(state.currentMatchId)!.playerGames.firstPlayerGames.gamesWon++
        state.stats.get(state.currentMatchId)!.playerGames.secondPlayerGames.gamesLost++
    }else if(state.playersScore.playerTwoScore >= POINTS_TO_WIN_GAME && pointsDifference >= POINTS_ADVANTAGE_REQUIED_TO_WIN){
        state.playerGamesWon.playerTwoGames++;
        state.playersScore = {
            playerOneScore: 0,
            playerTwoScore: 0
        }
        state.stats.get(state.currentMatchId)!.playerGames.firstPlayerGames.gamesLost++
        state.stats.get(state.currentMatchId)!.playerGames.secondPlayerGames.gamesWon++
    }
    // This may alter the next function so we put it last
    state = gameHasBeenWon(state);

    return state;
}
/**
 * Processes the next step for the state after a game has been won
 * @param state running parse state
 * @returns modified state
 */
export function gameHasBeenWon(state: ParsingState): ParsingState{
    if(state.playerGamesWon.playerOneGames === GAMES_TO_WIN_SET){
        state.playerSetsWon.playerOneSets++;
        state.playerGamesWon = {
            playerOneGames: 0,
            playerTwoGames: 0
        }

    }else if(state.playerGamesWon.playerTwoGames === GAMES_TO_WIN_SET){
        state.playerSetsWon.playerTwoSets++;
        state.playerGamesWon = {
            playerOneGames: 0,
            playerTwoGames: 0
        }
    }

    state = setHasBeenWon(state);
    return state;
    
}

/**
 * Processes the next step for the state after a set has been won
 * @param state running parse state
 * @returns modified state after a set has a been won
 */
export function setHasBeenWon(state: ParsingState): ParsingState{
    // We don't reset out sets here for now
    if(state.playerSetsWon.playerOneSets === SETS_TO_WIN_MATCH){
        state.matchWinner = state.players.playerOne;
        state = end(state);
    }else if(state.playerSetsWon.playerTwoSets === SETS_TO_WIN_MATCH){
        state.matchWinner = state.players.playerTwo;
        state = end(state);
    }

    return state;
}

/**
 * Processes the end of a match to set the stats and to keep going if more match lines are next. 
 * @param state parse state
 * @returns modified state
 */
export function end(state: ParsingState): ParsingState {
    const statForMatches = state.stats.get(state.currentMatchId);
    statForMatches!.players = state.players;
    statForMatches!.playerSetsWon = state.playerSetsWon;
    statForMatches!.winner = state.matchWinner;

    // Not sure if it will deep copy or what so just re-set it for clarity
    state.stats.set(state.currentMatchId, statForMatches!);

    state.nextStateFunction = startOfParse;
    return state;
}

/**
 * Parses a file into a state object which includes stats.
 * The state fields are not inclusive of all elements found. See the stats field of the state for the aggregated stats.
 * Will throw errors if any format or logic errors are found.
 * @param contents file contents to parse
 * @returns the parsed file in the form of a state, including the stats. 
 */
export function parseLines(contents: string): ParsingState{
    if(!contents || contents.length == 0){
        throw new InvalidFormat("Empty file");
    }

    // this will break on legacy mac OS as it uses \r as a line seperator
    // could maybe lift this to a config value
    const lines = contents.split("\n"); 
    if(lines.length <= 1){
        throw new InvalidFormat("Lines aren't seperated by new lines (\n)")
    }
    

    // Remove any carriage returns for windows
    lines[0] = lines[0].replace("\r", "");
    let state = startOfParse(lines[0], undefined);
    // drop the first line
    lines.splice(0, 1);

    lines.forEach((line) => {
        // Remove any carriage returns for windows
        line = line.replace("\r", "");
        // skip empty lines
        if(line.length > 0){
            state = state.nextStateFunction(line, state);
        }
    });
    if(state.nextStateFunction !== startOfParse){
        throw new InvalidFormat(`It appears that the match ${state.currentMatchId} never ended with a winner`);
    }

    return state;
}

// You could make this an async function however it currently doesn't add anything
/**
 * Reads in the provided file path and parses it. Will throw not found if it can't be read.
 * @param filePath file to read and parse
 * @returns the state from parsing the file
 */
export function readFileForParsing(filePath: string): ParsingState{
    // Using a try-catch here because we want to catch specific error handling
    try {
        const contents = fs.readFileSync(filePath, {encoding: "utf-8"});
        return parseLines(contents);
    } catch (err: any) {
        if (err?.code === "ENOENT") {
            throw new FileNotFound();
        }
        throw err;
    }
}