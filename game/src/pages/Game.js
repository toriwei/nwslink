import {
  PLAYERS,
  CONNECTIONS,
  MYSTERY_TEAM,
  MYSTERY_PLAYERS,
  CONNECTIONS_SET,
} from './game_utils'
import axios from 'axios'

class Game {
  constructor(IS_RANDOM_GAME) {
    this.IS_RANDOM_GAME = IS_RANDOM_GAME
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
    ]

    this.mysteryConnection = null

    this.mysteryPlayers = ['', '', '', '']
    this.playersSet = new Set()
    this.connectionsSet = new Set()
  }

  async setupGame() {
    if (this.IS_RANDOM_GAME) {
      for (let i = 0; i < 4; i++) {
        let mysteryPlayer = ''
        if (i == 0) {
          // get initial mystery player
          mysteryPlayer = await this.getRandomPlayer()

          // get mystery team
          let mysteryConnectionRecord = await this.getRandomPlayedFor(
            mysteryPlayer
          )
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
          this.connections.push(this.mysteryConnection)
        } else {
          // get random teammate of initial mystery player
          mysteryPlayer = await this.getUniqueTeammate(
            this.mysteryConnection.team,
            this.mysteryConnection.season
          )
        }
        // set mystery player
        this.playersSet.add(mysteryPlayer)
        this.mysteryPlayers[i] = mysteryPlayer
        this.players[i][3] = mysteryPlayer

        // get secondary connection
        let rowConnection = await this.getUniqueSeason(
          mysteryPlayer,
          this.mysteryConnection.team
        )

        this.connections[i]['team'] = rowConnection.team
        this.connections[i]['season'] = rowConnection.season
        // // get and set remaining players
        for (let j = 0; j < 3; j++) {
          let teammate = await this.getUniqueTeammate(
            rowConnection.team,
            rowConnection.season
          )
          this.players[i][j] = teammate
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

  // API CALL METHODS
  async checkAPIConnection() {
    try {
      await axios.get('http://127.0.0.1:5000/ping')
      return true
    } catch (error) {
      console.error('API connection failed', error)
      return false
    }
  }

  async getRandomPlayer() {
    try {
      const res = await axios.get('http://127.0.0.1:5000/random_player')
      return res.data.player
    } catch (e) {
      console.log(e)
      throw new Error('Failed to fetch random player')
    }
  }

  async getRandomPlayedFor(mysteryPlayer, team) {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/random_played_for`, {
        params: {
          player: mysteryPlayer,
          team: team || undefined,
        },
      })
      return res.data
    } catch (e) {
      console.log(e)
      throw new Error(
        `Failed to fetch random played-for relationship with params player= ${mysteryPlayer}, team= ${
          team || 'undefined'
        }`
      )
    }
  }

  async getRandomTeammate(team, season) {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/random_teammate`, {
        params: {
          team: team,
          season: season,
        },
      })
      return res.data.teammate
    } catch (e) {
      console.log(e)
      throw new Error(
        `Failed to fetch random teammate with params team= ${team}, season= ${season}`
      )
    }
  }

  // HELPER METHODS
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
      let teammate = await this.getRandomTeammate(team, season)
      if (!this.playersSet.has(teammate)) {
        this.playersSet.add(teammate)
        return teammate
      }
    }
  }

  async getUniqueSeason(player, team) {
    while (true) {
      let playedFor = await this.getRandomPlayedFor(player, team)
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
