import axios from 'axios'

export const checkAPIConnection = async () => {
  // TODO: attempted /ping but would still return true when server down
  try {
    await axios.get('http://127.0.0.1:5000/random_player')
    return true
  } catch (error) {
    console.error('API connection failed', error)
    return false
  }
}

export const getRandomPlayer = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:5000/random_player')
    return res.data.player
  } catch (e) {
    console.log(e)
    throw new Error('Failed to fetch random player')
  }
}

export const getRandomPlayedFor = async (mysteryPlayer, team) => {
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

export const getRandomTeammate = async (team, season) => {
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

export const isValidPlayer = async (name) => {
  try {
    const res = await axios.get('http://127.0.0.1:5000/is_valid_player', {
      params: {
        name: name,
      },
    })
    console.log(res.data)
    return res.data.is_valid_player
  } catch (e) {
    console.log(e)
    throw new Error('Failed to search player name')
  }
}

export const isValidTeamName = async (team) => {
  console.log(team)
  try {
    const res = await axios.get('http://127.0.0.1:5000/is_valid_team_name', {
      params: {
        team: team,
      },
    })
    console.log(res.data)
    return res.data.is_valid_team_name
  } catch (e) {
    console.log(e)
    throw new Error('Failed to search player name')
  }
}
