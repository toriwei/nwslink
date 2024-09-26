import { useState, useEffect, useRef } from 'react'
import Game from './Game'
import Grid from './Grid'

export default function GameRunner() {
  const IS_RANDOM_GAME = true
  const [game, setGame] = useState(null)
  const [gameProgress, setGameProgress] = useState({
    playersProgress: [],
    mysteryPlayersProgress: [],
    mysteryConnectionsProgress: [],
    playerGuessedList: new Array(4).fill(false),
    connectionsGuessedList: new Array(5).fill(false),
  })
  const hasRun = useRef(false)

  useEffect(() => {
    async function initializeGame() {
      const game = new Game(IS_RANDOM_GAME)
      await game.setupGame()
      // setGame(game)

      let playersProgress = game.setPlayersProgress(
        game.players.map((row) => [...row])
      )
      console.log(playersProgress)
      let mysteryPlayersProgress = playersProgress.map((row) => row[3])
      let mysteryConnectionsProgress = game.setConnectionsProgress(
        game.connections
      )
      let playerGuessedList = new Array(4).fill(false)
      let connectionsGuessedList = new Array(5).fill(false)

      setGameProgress({
        game: game,
        playersProgress,
        mysteryPlayersProgress,
        mysteryConnectionsProgress,
        playerGuessedList,
        connectionsGuessedList,
      })
    }
    if (!hasRun.current) {
      initializeGame()
      hasRun.current = true
    }
  }, [])

  return (
    <div>
      {gameProgress.playersProgress.length > 0 &&
      gameProgress.mysteryConnectionsProgress.length > 0 ? (
        <Grid
          players={gameProgress.playersProgress}
          connections={gameProgress.mysteryConnectionsProgress}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
