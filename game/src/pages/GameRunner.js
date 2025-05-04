import { useState, useEffect, useRef } from 'react'
import Game from '../utils/Game'
import Grid from './Grid'
import Guess from '../utils/Guess'
import RowInput from './RowInput'
import GuessInput from './GuessInput'
import Spinner from '../utils/Spinner'
import {
  checkAPIConnection,
  isValidPlayer,
  isValidTeamName,
} from '../../api/gameAPI'
const IS_RANDOM_GAME = true

export default function GameRunner({ updateStats, openStatsModal }) {
  const [setupError, setSetupError] = useState(null)
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
  const [gridRow, setGridRow] = useState(undefined)
  const [isPlayerGuess, setIsPlayerGuess] = useState(undefined)
  const [inputError, setInputError] = useState('')
  const [guess, setGuess] = useState('')
  const [showCorrect, setShowCorrect] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [guessLog, setGuessLog] = useState(
    Array.from({ length: 9 }).map(() => [])
  )
  const [guessCount, setGuessCount] = useState(0)
  const [playerGuessCount, setPlayerGuessCount] = useState(0)
  const [linkGuessCount, setLinkGuessCount] = useState(0)

  const increasePlayerGuessCount = () =>
    setPlayerGuessCount(playerGuessCount + 1)
  const increaseLinkGuessCount = () => setLinkGuessCount(linkGuessCount + 1)

  const handleRowSubmit = (e) => {
    e.preventDefault()

    const rowSelection = parseInt(e.target.elements.row.value)

    if (isNaN(rowSelection) || rowSelection < 1 || rowSelection > 9) {
      setInputError('Must be 1-9')
      e.target.elements.row.value = ''
      return
    }

    setInputError('')
    setGridRow(rowSelection)

    const isPlayerRow = rowSelection <= 4
    const rowIndex = isPlayerRow ? rowSelection - 1 : rowSelection - 5
    const isRowComplete = isPlayerRow
      ? gameProgress.playerGuessedList[rowIndex]
      : gameProgress.connectionsGuessedList[rowIndex]

    if (isRowComplete) {
      setInputError('Already complete!')
    } else {
      setRow(rowIndex)
      setIsPlayerGuess(isPlayerRow)
    }

    e.target.elements.row.value = ''
  }

  const handleGuess = async (e) => {
    e.preventDefault()
    setShowCorrect(false)
    setInputError('')

    const guessInput = e.target.elements.guess.value.trim().toUpperCase()
    if (guessInput === '') {
      setRow(undefined)
      setGuess('')
      return
    }

    if (isPlayerGuess) {
      if (!(await isValidPlayer(guessInput))) {
        e.target.elements.guess.value = ''
        setInputError('Not a valid NWSL player.')
        return
      }
    } else {
      if (!isValidConnectionFormat(guessInput)) {
        e.target.elements.guess.value = ''
        return
      }

      if (!(await checkValidTeamName(guessInput))) {
        e.target.elements.guess.value = ''
        return
      }
    }

    const guessConfig = isPlayerGuess
      ? {
          answer: gameProgress.game.mysteryPlayers[row],
          progress: gameProgress.mysteryPlayersProgress[row],
          sharedLetters: gameProgress.mysteryPlayersSharedLetters[row],
          sharedLettersKey: 'mysteryPlayersSharedLetters',
          progressKey: 'mysteryPlayersProgress',
          guessedListKey: 'playerGuessedList',
        }
      : {
          answer: gameProgress.game.connections[row],
          progress: gameProgress.mysteryConnectionsProgress[row],
          sharedLetters: gameProgress.mysteryConnectionsSharedLetters[row],
          sharedLettersKey: 'mysteryConnectionsSharedLetters',
          progressKey: 'mysteryConnectionsProgress',
          guessedListKey: 'connectionsGuessedList',
        }

    const guessObj = new Guess(
      guessConfig.answer,
      guessConfig.progress,
      guessConfig.sharedLetters,
      guessInput,
      isPlayerGuess
    )

    let result = guessObj.handleGuess()

    setGameProgress((prev) => ({
      ...prev,
      [guessConfig.sharedLettersKey]: prev[guessConfig.sharedLettersKey].map(
        (part, i) => (i === row ? result.sharedLetters : part)
      ),
      [guessConfig.progressKey]: prev[guessConfig.progressKey].map((part, i) =>
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
      [guessConfig.guessedListKey]: prev[guessConfig.guessedListKey].map(
        (guessed, i) => (i === row ? !result.progress.includes('_') : guessed)
      ),
    }))

    setGuess(getFormattedGuess(result))

    if (isPlayerGuess) {
      increasePlayerGuessCount()
    } else {
      increaseLinkGuessCount()
    }

    setGuessCount((prev) => {
      const newCount = parseInt(prev) + 1

      setGameProgress((prevProgress) => {
        const updatedProgress = {
          ...prevProgress,
          guessCount: newCount,
          playerGuessCount: playerGuessCount,
          linkGuessCount: linkGuessCount,
        }
        localStorage.setItem('currentGame', JSON.stringify(updatedProgress))
        return updatedProgress
      })
      return newCount
    })

    if (!result.progress.includes('_')) {
      setShowCorrect(true)
    }

    e.target.elements.guess.value = ''
    return
  }

  const isValidConnectionFormat = (guessInput) => {
    const lastFourDigits = guessInput
      .substring(guessInput.length - 5, guessInput.length)
      .trim()
    if (guessInput.length > 0 && !/^\d{4}$/.test(lastFourDigits)) {
      setInputError('Must include 4-digit year')
      return false
    }

    const season = parseInt(lastFourDigits, 10)
    if (season < 2013 || season > 2025 || season === 2020) {
      setInputError('Season must be between 2013 and 2025, excluding 2020')
      return false
    }
    return true
  }

  const checkValidTeamName = async (guessInput) => {
    const team = guessInput.substring(0, guessInput.length - 4).trim()
    const isValid = await isValidTeamName(team)
    if (!isValid) {
      setInputError('Must be a valid team name.')
    }
    return isValid
  }

  const getFormattedGuess = (result) => {
    let guessBuild = result.alignedGuess.replace(/!/g, '').split(' ')

    if (isPlayerGuess) {
      let leftovers = result.leftovers.length > 0 ? result.leftovers : []
      if (leftovers.length > 0) {
        guessBuild = guessBuild.concat(leftovers)
      }
    } else if (result.leftovers.length > 0) {
      guessBuild = [
        ...guessBuild.slice(0, guessBuild.length - 1),
        result.leftovers,
        guessBuild.slice(guessBuild.length - 1)[0],
      ]
    }

    setGuessLog((prev) => {
      const newGuessLog = prev.map((arr, index) =>
        index === gridRow - 1 ? [guessBuild, ...arr] : arr
      )
      setGameProgress((prevGameProgress) => {
        const updatedProgress = { ...prevGameProgress, guessLog: newGuessLog }
        localStorage.setItem('currentGame', JSON.stringify(updatedProgress))
        return updatedProgress
      })

      return newGuessLog
    })
    return guessBuild
  }

  // USE EFFECT
  useEffect(() => {
    const savedGame = JSON.parse(localStorage.getItem('currentGame'))
    async function initializeGame() {
      setSetupError(null)
      let game = undefined
      if (savedGame) {
        game = new Game(IS_RANDOM_GAME, savedGame)
        setGameProgress(savedGame)
        setGuessCount(savedGame.guessCount)
        setPlayerGuessCount(savedGame.playerGuessCount)
        setLinkGuessCount(savedGame.linkGuessCount)
        setGuessLog(savedGame.guessLog)
        setGameComplete(savedGame.gameComplete)

        const isConnected = await checkAPIConnection()
        if (!isConnected) {
          setSetupError(
            'Could not create a game at this time. Please try again later.'
          )
          return
        }
      } else {
        game = new Game(IS_RANDOM_GAME)
        const isConnected = await checkAPIConnection()
        if (!isConnected) {
          setSetupError(
            'Could not create a game at this time. Please try again later.'
          )
          return
        }

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

        const currentGameProgress = {
          game,
          playersProgress,
          mysteryPlayersProgress,
          mysteryPlayersSharedLetters,
          mysteryConnectionsProgress,
          mysteryConnectionsSharedLetters,
          playerGuessedList,
          connectionsGuessedList,
          guessCount,
          playerGuessCount,
          linkGuessCount,
          guessLog,
          gameComplete,
        }
        setGameProgress(currentGameProgress)

        localStorage.setItem('currentGame', JSON.stringify(currentGameProgress))
      }
    }

    if (!hasRun.current) {
      initializeGame()
      hasRun.current = true
    }
  }, [])

  useEffect(() => {
    if (
      !gameComplete &&
      !gameProgress.playerGuessedList.includes(false) &&
      !gameProgress.connectionsGuessedList.includes(false)
    ) {
      setGameComplete(true)
      setGameProgress((prevProgress) => {
        const updatedProgress = {
          ...prevProgress,
          guessCount: guessCount,
          playerGuessCount: playerGuessCount,
          linkGuessCount: linkGuessCount,
          gameComplete: true,
        }
        localStorage.setItem('currentGame', JSON.stringify(updatedProgress))
        return updatedProgress
      })
      updateStats(guessCount, playerGuessCount, linkGuessCount)
      setTimeout(() => {
        openStatsModal(true)
      }, 1000)
    }
  }, [gameProgress.playerGuessedList, gameProgress.connectionsGuessedList])

  return (
    <div className='h-5/6'>
      {setupError ? (
        <div className='text-red-500 text-center'>{setupError}</div>
      ) : gameProgress.playersProgress.length > 0 &&
        gameProgress.mysteryConnectionsProgress.length > 0 ? (
        <div>
          <Grid
            players={gameProgress.playersProgress}
            connections={gameProgress.mysteryConnectionsProgress}
          />
          <div className='min-h-24 sm:min-h-36 content-end'>
            {row === undefined ? (
              <RowInput
                handleRowSubmit={handleRowSubmit}
                inputError={inputError}
              />
            ) : (
              <GuessInput
                isPlayerGuess={isPlayerGuess}
                gameProgress={gameProgress}
                row={row}
                guess={guess}
                gridRow={gridRow}
                handleGuess={handleGuess}
                showCorrect={showCorrect}
                inputError={inputError}
                gameComplete={gameComplete}
                guessLog={guessLog[gridRow - 1]}
              />
            )}
          </div>
          <div className='flex flex-row mt-36 lg:mt-48 space-x-2'>
            <div className='flex-1 text-right'>
              <span className='pr-2'>Guesses:</span>
            </div>
            <div className='flex-1'>
              <span className=''>{guessCount}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col w-full text-center pt-8 space-y-8'>
          <p>Warming Up... Connecting passes... Stretching...</p>
          <span className='flex w-full justify-center'>
            <Spinner className='animate-spin' />
          </span>
        </div>
      )}
    </div>
  )
}
