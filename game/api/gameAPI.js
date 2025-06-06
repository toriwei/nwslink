import axios from 'axios'
const url = process.env.NEXT_PUBLIC_BACKEND_URL

export const checkAPIConnection = async () => {
  // TODO: attempted /ping but would still return true when server down
  try {
    await axios.get(`${url}/random_player`)
    return true
  } catch (error) {
    console.error('API connection failed', error)
    return false
  }
}

export const getRandomPlayer = async () => {
  try {
    const res = await axios.get(`${url}/random_player`)
    return res.data.player
  } catch (e) {
    throw new Error('Failed to fetch random player')
  }
}

export const getRandomPlayedFor = async (mysteryPlayer, team) => {
  try {
    const res = await axios.get(`${url}/random_played_for`, {
      params: {
        player: mysteryPlayer,
        team: team || undefined,
      },
    })
    return res.data
  } catch (e) {
    throw new Error(
      `Failed to fetch random played-for relationship with params player= ${mysteryPlayer}, team= ${
        team || 'undefined'
      }`
    )
  }
}

export const getRandomTeammate = async (team, season) => {
  try {
    const res = await axios.get(`${url}/random_teammate`, {
      params: {
        team: team,
        season: season,
      },
    })
    return res.data.teammate
  } catch (e) {
    throw new Error(
      `Failed to fetch random teammate with params team= ${team}, season= ${season}`
    )
  }
}

export const isValidPlayer = async (name) => {
  try {
    const res = await axios.get(`${url}/is_valid_player`, {
      params: {
        name: name,
      },
    })
    return res.data.is_valid_player
  } catch (e) {
    throw new Error('Failed to search player name')
  }
}

export const isValidTeamName = async (team) => {
  try {
    const res = await axios.get(`${url}/is_valid_team_name`, {
      params: {
        team: team,
      },
    })
    return res.data.is_valid_team_name
  } catch (e) {
    throw new Error('Failed to search player name')
  }
}
