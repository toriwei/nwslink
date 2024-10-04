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
  const [inputError, setInputError] = useState('')
  const [guess, setGuess] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleRowSubmit = (e) => {
    e.preventDefault()
    const rowSelection = parseInt(e.target.elements.row.value)
    if (rowSelection === NaN || rowSelection < 1 || rowSelection > 9) {
      setInputError('Must be 1-9')
    } else {
      setInputError('')
      if (rowSelection <= 4) {
        if (gameProgress.playerGuessedList[rowSelection - 1]) {
          setInputError('Already complete!')
        } else {
          setRow(rowSelection - 1)
          setIsPlayerGuess(true)
          console.log(
            'ANSWER:',
            gameProgress.game.mysteryPlayers[rowSelection - 1]
          )
        }
      } else {
        setRow(rowSelection - 5)
        setIsPlayerGuess(false)
        console.log('ANSWER:', gameProgress.game.connections[rowSelection - 5])
      }
    }
    e.target.elements.row.value = ''
  }

  const handleGuess = (e) => {
    e.preventDefault()
    const guessInput = e.target.elements.guess.value.toUpperCase()

    let answer,
      progress,
      sharedLetters,
      sharedLettersKey,
      progressKey,
      guessedListKey
    if (isPlayerGuess) {
      answer = gameProgress.game.mysteryPlayers[row]
      progress = gameProgress.mysteryPlayersProgress[row]
      sharedLetters = gameProgress.mysteryPlayersSharedLetters[row]
      sharedLettersKey = 'mysteryPlayersSharedLetters'
      progressKey = 'mysteryPlayersProgress'
      guessedListKey = 'playerGuessedList'
    } else {
      answer = gameProgress.game.connections[row]
      progress = gameProgress.mysteryConnectionsProgress[row]
      sharedLetters = gameProgress.mysteryConnectionsSharedLetters[row]
      sharedLettersKey = 'mysteryConnectionsSharedLetters'
      progressKey = 'mysteryConnectionsProgress'
      guessedListKey = 'connectionsGuessedList'
    }

    const guessObj = new Guess(
      answer,
      progress,
      sharedLetters,
      guessInput,
      isPlayerGuess
    )
    if (guessInput === '') {
      setRow(undefined)
      setGuess('')
      return
    }
    console.log(guessObj)
    let result = guessObj.handleGuess()
    console.log(result)

    setGameProgress((prev) => ({
      ...prev,
      [sharedLettersKey]: prev[sharedLettersKey].map((part, i) =>
        i === row ? result.sharedLetters : part
      ),
      [progressKey]: prev[progressKey].map((part, i) =>
        i === row ? result.progress : part
      ),
      playersProgress: isPlayerGuess
        ? prev.playersProgress.map((gridRow, i) =>
            i === row
              ? gridRow.map((player, j) => (j === 3 ? result.progress : player))
              : gridRow
          )
        : prev.playersProgress,
      mysteryConnectionsProgress: isPlayerGuess
        ? prev.mysteryConnectionsProgress
        : prev.mysteryConnectionsProgress.map((connection, i) =>
            i === row ? result.progress : connection
          ),
      [guessedListKey]: prev[guessedListKey].map((guessed, i) =>
        i === row ? !result.progress.includes('_') : guessed
      ),
    }))

    let guessBuild = result.alignedGuess.replace(/!/g, '').split(' ')

    if (isPlayerGuess) {
      let leftovers = result.leftovers.length > 0 ? result.leftovers : []
      if (leftovers.length > 0) {
        guessBuild = guessBuild.concat(leftovers)
      }
    } else if (result.leftovers.team.length > 0) {
      guessBuild = [
        ...guessBuild.slice(0, guessBuild.length - 1),
        result.leftovers.team,
        guessBuild.slice(guessBuild.length - 1)[0],
      ]
    }

    setGuess(guessBuild)

    if (!result.progress.includes('_')) {
      setSuccessMessage('Correct! Press enter to return to row selection.')
    } else {
      setSuccessMessage('')
    }

    e.target.elements.guess.value = ''
    return
  }

  const getFormattedSharedLetters = (letters) => {
    const parts = letters.map((part) => `[${part.join('')}]`)
    return parts.map((part, i) => (
      <span key={i} className='space-x-2'>
        {part.split('').map((char, j) => (
          <span key={j}>{char}</span>
        ))}
      </span>
    ))
  }

  const getFormattedProgress = (progress) => {
    const parts = (progress = progress.split(' '))
    return parts.map((part, i) => (
      <span key={i} className='space-x-2'>
        {part.split('').map((char, j) => (
          <span key={j}>{char}</span>
        ))}
      </span>
    ))
  }

  const isCorrectGuess = () => {
    const currentGuessResult = isPlayerGuess
      ? gameProgress.mysteryPlayersProgress[row]
      : gameProgress.mysteryConnectionsProgress[row]
    const guessedList = isPlayerGuess
      ? gameProgress.playerGuessedList
      : gameProgress.connectionsGuessedList

    return !currentGuessResult.includes('_') && guessedList[row]
  }
  useEffect(() => {
    async function initializeGame() {
      const game = new Game(IS_RANDOM_GAME)
      await game.setupGame()

      let playersProgress = game.setPlayersProgress(
        game.players.map((row) => [...row])
      )
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
      <div className='min-h-36 mx-48 content-end'>
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
                      autoFocus
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
            <div className='flex flex-col'>
              <div className='flex flex-row flex-1'>
                <div className='flex-1 text-right mr-4'>Shared Letters: </div>
                <div className='flex-1 space-x-8'>
                  {isPlayerGuess
                    ? getFormattedSharedLetters(
                        gameProgress.mysteryPlayersSharedLetters[row]
                      )
                    : getFormattedSharedLetters(
                        gameProgress.mysteryConnectionsSharedLetters[row]
                      )}
                </div>
              </div>
              <div className='flex flex-row flex-1 '>
                <div className='flex-1 text-right mr-4'>Your Guess: </div>
                <div className='flex-1 space-x-8'>
                  {guess &&
                    guess.map((part, i) => (
                      <span key={i} className='space-x-2'>
                        {part.split('').map((char, j) => (
                          <span key={j} className=''>
                            {char}
                          </span>
                        ))}
                      </span>
                    ))}
                </div>
              </div>
              <div className='flex flex-row flex-1'>
                <div className='flex-1 text-right mr-4'>Progress: </div>
                <div className='flex-1 space-x-8'>
                  {isPlayerGuess
                    ? getFormattedProgress(
                        gameProgress.mysteryPlayersProgress[row]
                      )
                    : getFormattedProgress(
                        gameProgress.mysteryConnectionsProgress[row]
                      )}
                </div>
              </div>
              <div className='flex flex-row flex-1'>
                <div className='flex-1 text-right mr-4'>
                  <label>Enter your guess:</label>
                </div>
                <div className='flex-1'>
                  <form onSubmit={handleGuess}>
                    <div className='flex'>
                      <div className='flex flex-col relative'>
                        {inputError && (
                          <p className='absolute -top-5 pl-4 text-red-500 text-sm'>
                            {inputError}
                          </p>
                        )}
                        <input
                          autoFocus
                          type='text'
                          className='border'
                          name='guess'
                          autoComplete='off'
                        />
                      </div>
                    </div>
                  </form>
                  <div className='h-6'>
                    {guess && isCorrectGuess() && (
                      <span className='absolute text-green-500 text-sm'>
                        {successMessage}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
