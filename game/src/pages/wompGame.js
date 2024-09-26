import { useState, useRef } from 'react'
import axios from 'axios'

// API CALL METHODS
const getRandomPlayer = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:5000/random_player')
    return res.data.player
  } catch (e) {
    console.log(e)
    throw new Error('Failed to fetch random player')
  }
}

const getRandomPlayedFor = async (mysteryPlayer, team) => {
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

const getRandomTeammate = async (team, season) => {
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
const getRandomSeason = async (seasons) => {
  const cleanedSeasons = seasons
    .replace('[', '')
    .replace(']', '')
    .replace(/'/g, '')
    .split(', ')
  return cleanedSeasons[Math.floor(Math.random() * cleanedSeasons.length)]
}

const getUniqueTeammate = async (team, season) => {
  while (true) {
    let teammate = await getRandomTeammate(team, season)
    if (!playersSet.current.has(teammate)) {
      playersSet.current.add(teammate)
      return teammate
    }
  }
}

const getUniqueSeason = async (player, team) => {
  while (true) {
    let playedFor = await getRandomPlayedFor(player, team)
    let randomSeason = await getRandomSeason(playedFor.seasons)
    let playedForObj = { team: playedFor.team, season: randomSeason }

    if (!connectionsSet.current.has(playedForObj)) {
      connectionsSet.current.add(playedForObj)
      return playedForObj
    }
  }
}

export const setupGame = async (IS_RANDOM_GAME) => {
  if (IS_RANDOM_GAME) {
    let [players, setPlayers] = useState([
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
    ])
    let connections = useRef([
      { team: '', season: '' },
      { team: '', season: '' },
      { team: '', season: '' },
      { team: '', season: '' },
    ])
    let mysteryPlayers = useRef(['', '', '', ''])
    let mysteryConnection = useRef(null)
    let playersSet = useRef(new Set())
    let connectionsSet = useRef(new Set())

    for (let i = 0; i < 4; i++) {
      let mysteryPlayer = ''
      if (i == 0) {
        // get initial mystery player
        mysteryPlayer = await getRandomPlayer()

        // get mystery team
        let mysteryConnectionRecord = await getRandomPlayedFor(mysteryPlayer)
        let mysteryConnectionSeason = await getRandomSeason(
          mysteryConnectionRecord.seasons
        )
        mysteryConnection.current = {
          team: mysteryConnectionRecord.team,
          season: mysteryConnectionSeason,
        }

        console.log(`initial mystery player: ${mysteryPlayer}`)
        // set mystery team
        console.log(
          `i: ${i} | col connection: ${mysteryConnection.current.team} ${mysteryConnection.current.season}`
        )
        connectionsSet.current.add(mysteryConnection.current)
        connections.current.push(mysteryConnection.current)
        console.log(connectionsSet.current)
        console.log(connections.current)
      } else {
        // get random teammate of initial mystery player
        mysteryPlayer = await getUniqueTeammate(
          mysteryConnection.current.team,
          mysteryConnection.current.season
        )
      }
      // set mystery player
      playersSet.current.add(mysteryPlayer)
      mysteryPlayers.current[i] = mysteryPlayer
      setPlayers((prevPlayers) => {
        const updatedPlayers = [...prevPlayers]
        updatedPlayers[i][3] = mysteryPlayer
        return updatedPlayers
      })

      // get secondary connection
      let rowConnection = await getUniqueSeason(
        mysteryPlayer,
        mysteryConnection.current.team
      )

      connections.current[i]['team'] = rowConnection.team
      connections.current[i]['season'] = rowConnection.season
      // // get and set remaining players
      for (let j = 0; j < 3; j++) {
        let teammate = await getUniqueTeammate(
          rowConnection.team,
          rowConnection.season
        )
        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers]
          updatedPlayers[i][j] = teammate
          return updatedPlayers
        })
      }
    }
    console.log('DONE')
    console.log(players)
    console.log(connections.current)
    console.log(mysteryPlayers.current)
  }
}

// useEffect(() => {
//   if (hasRun.current) return
//   hasRun.current = true
//   setupGame()
// }, [])

// return (
//   <div>
//     <h1>Game</h1>
//   </div>
// )
