import { useState, useEffect, useRef } from 'react'
import Game from './Game'
import Grid from './Grid'
import Guess from './Guess'

export default function GameRunner() {
  const IS_RANDOM_GAME = false
  const [gameProgress, setGameProgress] = useState({
    game: null,
    playersProgress: [],
    mysteryPlayersProgress: [],
    mysteryPlayersSharedLetters: [],
    mysteryConnectionsProgress: [],
    mysteryConnectionsSharedLetters: [],
    playerGuessedList: [false, false, false, false],
    connectionsGuessedList: [false, false, false, false, false],
  })
  const hasRun = useRef(false)

  const [row, setRow] = useState(undefined)
  const [isPlayerGuess, setIsPlayerGuess] = useState(undefined)
  const [guess, setGuess] = useState(null)
  const [guessResult, setGuessResult] = useState(null)
  const [inputError, setInputError] = useState('')

  const handleRowSubmit = (e) => {
    e.preventDefault()
    const rowSelection = parseInt(e.target.elements.row.value)
    if (rowSelection === NaN || rowSelection < 1 || rowSelection > 9) {
      setInputError('Must be 1-9')
    } else {
      setInputError('')
      if (rowSelection <= 4) {
        setRow(rowSelection - 1)
        setIsPlayerGuess(true)
      } else {
        setRow(rowSelection - 5)
        setIsPlayerGuess(false)
      }
    }
    e.target.elements.row.value = ''
  }

  // could condense player and link guess
  const handlePlayerGuess = (e) => {
    e.preventDefault()
    const guessInput = e.target.elements.guess.value
    const answer = gameProgress.game.mysteryPlayers[row]
    const progress = gameProgress.mysteryPlayersProgress[row]
    const sharedLetters = gameProgress.mysteryPlayersSharedLetters[row]
    const guessObj = new Guess(
      answer,
      progress,
      sharedLetters,
      guessInput,
      isPlayerGuess
    )

    // setGuess(guessObj)
    console.log(guessObj)
    return
  }

  const handleLinkGuess = (e) => {
    e.preventDefault()
    const guessInput = e.target.elements.guess.value
    const answer = gameProgress.game.connections[row]
    const progress = gameProgress.mysteryConnectionsProgress[row]
    const sharedLetters = gameProgress.mysteryPlayersSharedLetters[row]

    const guessObj = new Guess(
      answer,
      progress,
      sharedLetters,
      guessInput,
      isPlayerGuess
    )
    console.log(guessObj)
    return
  }

  useEffect(() => {
    async function initializeGame() {
      const game = new Game(IS_RANDOM_GAME)
      await game.setupGame()

      let playersProgress = game.setPlayersProgress(
        game.players.map((row) => [...row])
      )
      // console.log(playersProgress)
      let mysteryPlayersProgress = playersProgress.map((row) => row[3])
      let mysteryConnectionsProgress = game.setConnectionsProgress(
        game.connections
      )
      let playerGuessedList = [false, false, false, false]
      let connectionsGuessedList = [false, false, false, false, false]

      let mysteryPlayersSharedLetters = [[], [], [], []]
      let mysteryConnectionsSharedLetters = [[], [], [], [], []]

      setGameProgress({
        game,
        playersProgress,
        mysteryPlayersProgress,
        mysteryPlayersSharedLetters,
        mysteryConnectionsProgress,
        mysteryConnectionsSharedLetters,
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
      <div className='mt-12 text-center'>
        {row === undefined ? (
          <div>
            <form onSubmit={handleRowSubmit}>
              <label>
                <div className='flex justify-center'>
                  <span className='mr-4'>Enter a number 1-9:</span>
                  <div className='flex flex-col relative'>
                    {inputError && (
                      <p className='absolute -top-5 pl-4 text-red-500 text-sm'>
                        {inputError}
                      </p>
                    )}
                    <input
                      type='number'
                      className='border'
                      name='row'
                      autoComplete='off'
                      onKeyDown={(e) =>
                        ['e', 'E', '+', '-', '.'].includes(e.key) &&
                        e.preventDefault()
                      }
                    />
                  </div>
                </div>
              </label>
            </form>
          </div>
        ) : (
          <div>
            <form
              onSubmit={isPlayerGuess ? handlePlayerGuess : handleLinkGuess}
            >
              <label>
                <div className='flex justify-center'>
                  <span className='mr-4'>Enter your guess:</span>
                  <div className='flex flex-col relative'>
                    {inputError && (
                      <p className='absolute -top-5 pl-4 text-red-500 text-sm'>
                        {inputError}
                      </p>
                    )}
                    <input
                      type='text'
                      className='border'
                      name='guess'
                      autoComplete='off'
                    />
                  </div>
                </div>
              </label>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
