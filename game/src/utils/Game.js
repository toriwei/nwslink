import {
  PLAYERS,
  CONNECTIONS,
  MYSTERY_TEAM,
  MYSTERY_PLAYERS,
  CONNECTIONS_SET,
} from './game_utils'

import {
  getRandomPlayer,
  getRandomPlayedFor,
  getRandomTeammate,
} from '../../api/gameAPI'

const TESTING = false

class Game {
  constructor(IS_RANDOM_GAME, existingGame = undefined) {
    this.IS_RANDOM_GAME = IS_RANDOM_GAME
    this.existingGame = existingGame

    if (this.existingGame) {
      console.log('GAME LOADING')
      this.players = this.existingGame.players
      this.connections = this.existingGame.connections
      this.mysteryConnection = this.existingGame.mysteryConnection
      this.mysteryPlayers = this.existingGame.mysteryPlayers
    } else {
      this.players = [
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
      ]

      this.connections = [
        { team: '', season: '' },
        { team: '', season: '' },
        { team: '', season: '' },
        { team: '', season: '' },
        { team: '', season: '' },
      ]

      this.mysteryConnection = null

      this.mysteryPlayers = ['', '', '', '']
      this.playersSet = new Set()
      this.connectionsSet = new Set()
    }
  }
  async setupGame() {
    if (this.IS_RANDOM_GAME) {
      for (let i = 0; i < 4; i++) {
        let mysteryPlayer = ''
        if (i == 0) {
          // get initial mystery player
          mysteryPlayer = await getRandomPlayer()

          // get mystery team
          let mysteryConnectionRecord = await getRandomPlayedFor(mysteryPlayer)
          let mysteryConnectionSeason = await this.getRandomSeason(
            mysteryConnectionRecord.seasons
          )
          this.mysteryConnection = {
            team: mysteryConnectionRecord.team,
            season: mysteryConnectionSeason,
          }

          // set mystery team
          this.connectionsSet.add(
            `${this.mysteryConnection.team}-${this.mysteryConnection.season}`
          )
          this.connections[4] = this.mysteryConnection

          if (TESTING) {
            console.log(
              `MYSTERY LINK 9: ${this.mysteryConnection.team} ${this.mysteryConnection.season}`
            )
            console.log('')
          }
        } else {
          // get random teammate of initial mystery player
          mysteryPlayer = await this.getUniqueTeammate(
            this.mysteryConnection.team,
            this.mysteryConnection.season
          )
        }
        // set mystery player
        this.setMysteryPlayer(i, mysteryPlayer)
        if (TESTING) {
          console.log('')
          console.log(`MYSTERY PLAYER ${i + 1}: ${mysteryPlayer}`)
        }
        // get secondary connection
        let rowConnection = null
        while (rowConnection === null) {
          rowConnection = await this.getUniqueSeason(
            mysteryPlayer,
            this.mysteryConnection.team
          )
          if (rowConnection) {
            break
          }
          if (TESTING) {
            console.log('RESETTING')
          }
          this.playersSet.delete(mysteryPlayer)
          // TODO: add impossible mystery player to list, make sure new mysteryPlayer is not impossible
          mysteryPlayer = await this.getUniqueTeammate(
            this.mysteryConnection.team,
            this.mysteryConnection.season
          )
          this.setMysteryPlayer(i, mysteryPlayer)
        }

        this.connections[i]['team'] = rowConnection.team
        this.connections[i]['season'] = rowConnection.season

        if (TESTING) {
          console.log(
            `MYSTERY LINK ${i + 1}: ${rowConnection.team} ${
              rowConnection.season
            }`
          )
        }
        // get and set remaining players
        for (let j = 0; j < 3; j++) {
          let teammate = await this.getUniqueTeammate(
            rowConnection.team,
            rowConnection.season
          )
          this.players[i][j] = teammate
        }
        if (TESTING) {
          console.log('')
        }
      }

      this.players = this.players.map((row) =>
        row.map((player) => player.toUpperCase())
      )
      this.mysteryPlayers = this.mysteryPlayers.map((player) =>
        player.toUpperCase()
      )
      this.connections = this.connections.map(
        (connection) => `${connection.team.toUpperCase()} ${connection.season}`
      )
    } else {
      this.players = PLAYERS
      this.connections = CONNECTIONS
      this.mysteryConnection = MYSTERY_TEAM
      this.mysteryPlayers = MYSTERY_PLAYERS
      this.connectionsSet = CONNECTIONS_SET
    }
  }

  // HELPER METHODS
  setMysteryPlayer(i, mysteryPlayer) {
    this.playersSet.add(mysteryPlayer)
    this.mysteryPlayers[i] = mysteryPlayer
    this.players[i][3] = mysteryPlayer
  }

  async getRandomSeason(seasons) {
    const cleanedSeasons = seasons
      .replace('[', '')
      .replace(']', '')
      .replace(/'/g, '')
      .split(', ')
    return cleanedSeasons[Math.floor(Math.random() * cleanedSeasons.length)]
  }

  async getUniqueTeammate(team, season) {
    while (true) {
      let teammate = await getRandomTeammate(team, season)
      if (TESTING) {
        console.log(
          `TEAMMATE: ${teammate} | IN SET: ${this.playersSet.has(teammate)}`
        )
      }

      if (!this.playersSet.has(teammate)) {
        this.playersSet.add(teammate)
        return teammate
      }
    }
  }

  // TODO: can probably reduce attempts by checking amount of playedFor teams and and/or randomSeason seasons available
  async getUniqueSeason(player, team) {
    const maxAttempts = 10

    for (let i = 0; i < maxAttempts; i++) {
      let playedFor = await getRandomPlayedFor(player, team)
      let randomSeason = await this.getRandomSeason(playedFor.seasons)

      let playedForStr = `${playedFor.team}-${randomSeason}`
      let playedForObj = { team: playedFor.team, season: randomSeason }

      if (
        !this.connectionsSet.has(playedForStr) &&
        playedFor.team !== this.mysteryConnection.team
      ) {
        this.connectionsSet.add(playedForStr)
        return playedForObj
      }
    }
    return null
  }

  // STRING MANIPULATION HELPER METHODS
  getUnderscoredPhrase(phrase) {
    return phrase
      .split(' ')
      .map((phrasePart) =>
        phrasePart
          .split('')
          .map(() => '_')
          .join('')
      )
      .join(' ')
  }

  setPlayersProgress(players) {
    for (let i = 0; i < 4; i++) {
      players[i][3] = this.getUnderscoredPhrase(players[i][3])
    }
    return players
  }

  setConnectionsProgress(connections) {
    return connections.map((connection) =>
      this.getUnderscoredPhrase(connection)
    )
  }
}

export default Game
