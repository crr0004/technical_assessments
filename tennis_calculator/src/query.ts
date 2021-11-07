import { MatchStat } from "./types";

export const NOT_MATCHED_RESPONSE = "Sorry I couldn't get that. Try typing help for possible queries or end to close.";
export const HELP_MESSAGE = `You can type the following for queries:
Score Match <id> to get the scores for a match.
Games Player <Player Name> to get the games won vs lost`;
const HELP_REGEX = /^help/i;
const SCORE_REGEX = /^Score Match (\d+)$/i;
const GAMES_SCORE_REGEX = /^Games Player (.+)$/i;

/**
 * Outputs the match stats for the provided match. 
 * @param matchStats match stats to query
 * @returns the string to output to the user.
 */
export function handleMatchScore(matchStats: MatchStat): string{

    const sets = matchStats.playerSetsWon;
    let whoWonLine = "";
    if(sets.playerOneSets > sets.playerTwoSets){
        whoWonLine = `${matchStats.players.playerOne} defeated ${matchStats.players.playerTwo}`;
    }else{
        whoWonLine = `${matchStats.players.playerTwo} defeated ${matchStats.players.playerOne}`;
    }

    return `${whoWonLine}
${sets.playerOneSets} sets to ${sets.playerTwoSets}`;
}

/**
 * Tallys the game scores for the provided player id by scanning the matches. 
 * @param stats the match stats to query
 * @param player player id to tally game scores
 * @returns the string to output to the user
 */
export function handleGamesScore(stats: Map<number, MatchStat>, player: string): string{
    let gamesWon = 0;
    let gamesLost = 0;
    stats.forEach((match) => {
        if(match.players.playerOne === player ){
            gamesWon += match.playerGames.firstPlayerGames.gamesWon;
            gamesLost += match.playerGames.firstPlayerGames.gamesLost;
        } else if(match.players.playerTwo === player){
            gamesWon += match.playerGames.secondPlayerGames.gamesWon;
            gamesLost += match.playerGames.secondPlayerGames.gamesLost;
        }
    });
    return `${gamesWon} ${gamesLost}`;
}

/**
 * Parses and handles queries for the provided stats.
 * Supports match scores or player game tallies. 
 * @param line line query to parse
 * @param matches match stats to query
 * @returns the string to output to the user
 */
export function handleQuery(line: string, matches: Map<number, MatchStat> | undefined): string{
    // There is probably a better way to check each line match but this will do for now
    if(line.match(HELP_REGEX)){
        return HELP_MESSAGE;
    }

    const scoreLineMatch = line.match(SCORE_REGEX);
    if(scoreLineMatch){
        const match = matches!.get(Number(scoreLineMatch[1]));
        if(match){
            return handleMatchScore(matches!.get(Number(scoreLineMatch[1]))!);
        }
        return `Sorry I couldn't find that match with id ${scoreLineMatch[1]}`;
    }
    const gameScoreRegex = line.match(GAMES_SCORE_REGEX);
    if(gameScoreRegex){
        return handleGamesScore(matches!, gameScoreRegex[1]);
    }

    return NOT_MATCHED_RESPONSE;
}
