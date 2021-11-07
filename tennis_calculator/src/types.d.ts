export interface Match{
    players: [string, string],
    playersScore: [number, number],
    playerSetsWon: [number, number],
    

}

// I orginially had this as tuples for players however changed it so it is more explicit which is which
export interface ParsingState {
    currentMatchId: number,
    players: {
        playerOne: string,
        playerTwo: string
    }
    playersScore: {
        playerOneScore: number,
        playerTwoScore: number
    }
    playerGamesWon: {
        playerOneGames: number,
        playerTwoGames: number
    }
    playerSetsWon: {
        playerOneSets: number,
        playerTwoSets: number
    }
    matchWinner: string,
    previousStateFunction: StateMachineFunction
    nextStateFunction: StateMachineFunction,
    stats: Map<number, MatchStat>
}

export interface MatchStat {
    players: {
        playerOne: string,
        playerTwo: string
    }
    playerSetsWon: {
        playerOneSets: number,
        playerTwoSets: number
    }
    winner: string,
    playerGames: {
        firstPlayerGames: {
            gamesWon: number,
            gamesLost: number
        },
        secondPlayerGames: {
            gamesWon: number,
            gamesLost: number
        }
    }
}

export type StateMachineFunction = ((line: string, state: ParsingState) => ParsingState)